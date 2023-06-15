'use strict';

import Concat from 'broccoli-concat';
import { Funnel } from 'broccoli-funnel';
import MergeTrees from 'broccoli-merge-trees';
import Filter from 'broccoli-persistent-filter';
import path from 'path';

import fsExists from './fsExists.js';
import { packageScopedPathToModulePath } from './generateAbsolutePathHash.js';
import generateHash from './generateRelativePathHash.js';
import rewriteCss from './rewriteCss.js';

const COMPONENT_EXTENSIONS = ['hbs', 'js', 'ts', 'gjs', 'gts'];

class ScopedFilter extends Filter {
  constructor(componentsNode, options = {}) {
    super(componentsNode, options);
    this.warningStream = process.stderr;
  }

  get extensions() {
    return ['css'];
  }

  get targetExtension() {
    return 'css';
  }

  async processString(content, relativePath) {
    // ignore css files for ember-css-modules
    if (relativePath.endsWith('.module.css')) {
      return '';
    }

    // check if corresponding js file exists
    const existPromises = [];

    for (let inputPath of this.inputPaths) {
      for (let ext of COMPONENT_EXTENSIONS) {
        const relativeComponentPath = relativePath.replace(/\.css$/, '.' + ext);
        const componentPath = path.join(inputPath, relativeComponentPath);

        existPromises.push(fsExists(componentPath));
      }
    }

    const existResults = await Promise.all(existPromises);
    const componentExists = existResults.some((r) => r);

    // rewrite css file
    if (componentExists) {
      let localPackagerStylePath = packageScopedPathToModulePath(relativePath);

      const hash = generateHash(localPackagerStylePath);

      content = rewriteCss(content, hash, relativePath);

      return content;
    } else {
      return '';
    }
  }
}

export default class ScopedCssPreprocessor {
  constructor(options) {
    this.owner = options.owner;
    this.appName = options.owner.parent.pkg.name;
  }

  toTree(inputNode, inputPath, outputDirectory, options) {
    const otherTrees = this.preprocessors.map((p) => p.toTree(...arguments));
    let mergedOtherTrees = new MergeTrees(otherTrees);

    let componentsNode = new Funnel(inputNode, {
      include: [
        this.appName + '/components/**/*.css',
        ...COMPONENT_EXTENSIONS.map(
          (ext) => this.appName + `/components/**/*.${ext}`
        ),
      ],
    });

    componentsNode = new ScopedFilter(componentsNode, {
      inputPath,
    });

    const componentStyles = new Funnel(componentsNode, {
      include: [this.appName + '/components/**/*.css'],
    });

    const appCss = new Funnel(inputNode, {
      include: [this.appName + '/styles/app.css'],
    });

    let mergedStyles = new MergeTrees([
      appCss,
      mergedOtherTrees,
      componentStyles,
    ]);

    let newOutput = new Concat(mergedStyles, {
      outputFile: options.outputPaths['app'],
      allowNone: true,
      sourceMapConfig: { enabled: true },
    });

    return newOutput;
  }
}
