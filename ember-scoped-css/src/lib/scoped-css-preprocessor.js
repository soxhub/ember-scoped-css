'use strict';

import Concat from 'broccoli-concat';
import { Funnel } from 'broccoli-funnel';
import MergeTrees from 'broccoli-merge-trees';
import Filter from 'broccoli-persistent-filter';
import path from 'path';

import fsExists from './fsExists.js';
import { readFile, writeFile } from 'fs/promises';
import { packageScopedPathToModulePath } from './generateAbsolutePathHash.js';
import getClassesTagsFromCss from './getClassesTagsFromCss.js';
import generateHash from './generateRelativePathHash.js';
import rewriteCss from './rewriteCss.js';
import rewriteHbs from './rewriteHbs.js';

const COMPONENT_EXTENSIONS = ['hbs', 'js', 'ts', 'gjs', 'gts'];
const TEMPLATE_EXTENSIONS = ['hbs', 'gjs', 'gts'];

class ScopedFilter extends Filter {
  constructor(componentsNode, options = {}) {
    super(componentsNode, options);
    this.warningStream = process.stderr;
    this.options = options;
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

      content = rewriteCss(
        content,
        hash,
        relativePath,
        this.options.getUserOptions?.()?.layerName
      );

      return content;
    } else {
      return '';
    }
  }
  async postProcess(results, relativePath) {
    if (relativePath.endsWith('.module.css')) {
      return results;
    }

    // need to add gjs/gts support
    // check existence of gjs and gts files
    // extract template tag

    const templatePath = relativePath.replace(/\.css/, '.hbs');

    for (let inputPath of this.inputPaths) {
      const templateFilePath = path.join(inputPath, templatePath);
      const fileExists = await fsExists(templateFilePath);

      if (fileExists) {
        const cssFilePath = path.join(inputPath, relativePath);
        const cssContents = await readFile(cssFilePath,  'utf-8');
        const { classes, tags } = getClassesTagsFromCss(cssContents);

        const previousClasses = this.options.previousClasses.get(relativePath);

        // if we have previous classes, and they are different, build templates to compare
        if (previousClasses && classes.toString() !== previousClasses.toString()) {
          const localPackagerStylePath = packageScopedPathToModulePath(relativePath);
          const postfix = generateHash(localPackagerStylePath);
          const templateContents = await readFile(templateFilePath,  'utf-8');
          const templateOriginal = rewriteHbs(templateContents, previousClasses, tags, postfix);
          const templateRewrite = rewriteHbs(templateContents, classes, tags, postfix);
          // if the rewrite doesn't match the original output, we want to rebuild the template
          if (templateOriginal !== templateRewrite) {
            // this is an awful hack because we don't know how to invalidate broccoli-persistent-filter cache
            // ideally we'd invalidate the broccoli-peristent-filter cache here
            await writeFile(templateFilePath, templateContents + ' ');
          }
        }
        // assign for next run comparison
        this.options.previousClasses.set(relativePath, classes);
      }
    }

    return results;
  }
}

export default class ScopedCssPreprocessor {
  constructor(options) {
    this.owner = options.owner;
    this.appName = options.owner.parent.pkg.name;
    this.name = 'scoped-css-preprocessor';
    this.previousClasses = new Map();
  }

  /**
   * Sets the options from `setupPreprocessorRegistry`, the v1-Addon Hook
   * @param {{ layerName?: string }} options
   */
  configureOptions(options) {
    this.userOptions = options || { ['not configured']: true };
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
      getUserOptions: () =>  this.userOptions,
      owner: this.owner,
      previousClasses: this.previousClasses,
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
