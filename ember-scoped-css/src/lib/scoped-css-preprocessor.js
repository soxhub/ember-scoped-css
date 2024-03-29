'use strict';

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import Concat from 'broccoli-concat';
import { Funnel } from 'broccoli-funnel';
import MergeTrees from 'broccoli-merge-trees';
import Filter from 'broccoli-persistent-filter';
import { Preprocessor } from 'content-tag';

import fsExists from './fsExists.js';
import { packageScopedPathToModulePath } from './generateAbsolutePathHash.js';
import generateHash from './generateRelativePathHash.js';
import getClassesTagsFromCss from './getClassesTagsFromCss.js';
import rewriteCss from './rewriteCss.js';
import rewriteHbs from './rewriteHbs.js';

const p = new Preprocessor();
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

  async postProcess(results, relativePath) {
    if (process.env.CI || relativePath.endsWith('.module.css')) {
      return results;
    }

    for (let inputPath of this.inputPaths) {
      const templateFile = {};

      eachExtension: for (let ext of TEMPLATE_EXTENSIONS) {
        const templatePath = relativePath.replace(/\.css/, '.' + ext);
        let templateFilePath = path.join(inputPath, templatePath);
        let exists = await fsExists(templateFilePath);

        /**
         * Pods support
         */
        if (ext === 'hbs' && !exists && relativePath.endsWith('styles.css')) {
          let podsName = relativePath.replace(/styles\.css$/, 'template.hbs');

          templateFilePath = path.join(inputPath, podsName);
          exists = await fsExists(templateFilePath);
        }

        if (exists) {
          templateFile.path = templateFilePath;
          templateFile.ext = ext;

          break eachExtension;
        }
      }

      // if the template exists we check the css for changes
      if (templateFile.path) {
        const cssFilePath = path.join(inputPath, relativePath);
        const cssContents = await readFile(cssFilePath, 'utf-8');
        const { classes, tags } = getClassesTagsFromCss(cssContents);
        const previousClasses = this.options.previousClasses.get(relativePath);

        // if we have previous classes, and they are different, build templates to compare
        if (previousClasses && classes !== previousClasses) {
          const localPackagerStylePath =
            packageScopedPathToModulePath(relativePath);
          const postfix = generateHash(localPackagerStylePath);
          const templateRaw = await readFile(templateFile.path, 'utf-8');
          const templateComparison = [];
          let templateContents = templateRaw;

          if (templateFile.ext === 'hbs') {
            templateComparison.push(
              didTemplateChange(
                templateContents,
                previousClasses,
                classes,
                tags,
                postfix,
              ),
            );
          } else {
            // find all template tags, and extract the contents to compare
            const results = p.parse(templateRaw, '');
            const templates = results.map((x) => x.contents);

            for (let template of templates) {
              templateComparison.push(
                didTemplateChange(
                  template,
                  previousClasses,
                  classes,
                  tags,
                  postfix,
                ),
              );
            }
          }

          const templateChanged = templateComparison.some((v) => v);

          // if the rewrite doesn't match the original output, we want to rebuild the template
          if (templateChanged) {
            // this is an awful hack because we don't know how to invalidate broccoli-persistent-filter cache
            // ideally we'd invalidate the broccoli-peristent-filter cache here
            await writeFile(templateFile.path, templateContents + ' ');
          }
        }
        // assign for next run comparison

        this.options.previousClasses.set(relativePath, classes);
      }
    }

    return results;
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
