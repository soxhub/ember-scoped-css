'use strict';

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import Concat from 'broccoli-concat';
import { Funnel } from 'broccoli-funnel';
import MergeTrees from 'broccoli-merge-trees';
import Filter from 'broccoli-persistent-filter';
import { parseTemplates } from 'ember-template-tag';

import fsExists from './fsExists.js';
import { packageScopedPathToModulePath } from './generateAbsolutePathHash.js';
import generateHash from './generateRelativePathHash.js';
import getClassesTagsFromCss from './getClassesTagsFromCss.js';
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

      /**
       * Pods support
       */
      if (relativePath.endsWith('styles.css')) {
        const directory = relativePath.replace(/styles\.css$/, 'template.hbs');
        const templatePath = path.join(inputPath, directory);

        existPromises.push(fsExists(templatePath));
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
        this.options.getUserOptions?.()?.layerName,
      );

      return content;
    } else {
      return '';
    }
  }
}

/**
 * Compares a template with the context of different sets of extraced css classes
 *
 * @param {string} contents
 * @param {Set} previousClasses
 * @param {Set} currentClasses
 * @param {Set} tags
 * @param {string} postfix
 * @returns {Boolean}
 */
function didTemplateChange(
  contents,
  previousClasses,
  currentClasses,
  tags,
  postfix,
) {
  const original = rewriteHbs(contents, previousClasses, tags, postfix);
  const current = rewriteHbs(contents, currentClasses, tags, postfix);

  return original !== current;
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
    const otherPreprocessors = this.preprocessors.filter((p) => p !== this);
    const otherTrees = otherPreprocessors.map((p) => p.toTree(...arguments));
    let mergedOtherTrees = new MergeTrees(otherTrees);

    let roots = [
      this.appName + '/components/',
      ...(this.userOptions.additionalRoots || []).map(
        (root) => `${this.appName}/${root}`,
      ),
    ];
    let include = roots
      .map((root) => {
        let withSlash = root.endsWith('/') ? root : `${root}/`;

        return [
          `${withSlash}**/*.css`,
          ...COMPONENT_EXTENSIONS.map((ext) => `${withSlash}**/*.${ext}`),
        ];
      })
      .flat();

    let componentsNode = new Funnel(inputNode, { include });

    componentsNode = new ScopedFilter(componentsNode, {
      inputPath,
      getUserOptions: () => this.userOptions,
      owner: this.owner,
      previousClasses: this.previousClasses,
    });

    const componentStyles = new Funnel(componentsNode, {
      include: roots.map((root) => {
        let withSlash = root.endsWith('/') ? root : `${root}/`;

        return `${withSlash}**/*.css`;
      }),
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
