import { existsSync, readFileSync } from 'fs';
import nodePath from 'path';
import { ImportUtil } from 'babel-import-util';

import getClassesTagsFromCss from '../lib/getClassesTagsFromCss.js';
import {
  cssPathFor,
  hashFromModulePath,
  isRelevantFile,
  packageScopedPathToModulePath,
} from '../lib/path/utils.js';
import rewriteHbs from '../lib/rewriteHbs.js';

function _isRelevantFile(state, cwd) {
  let fileName = state.file.opts.filename;
  let additionalRoots = state.opts?.additionalRoots;

  return isRelevantFile(fileName, {
    additionalRoots,
    cwd,
  });
}

/**
 * @param {any} env - babel plugin env, env.types is most commonly used (esp in TS)
 * @param {object} options - the options for scoped-css -- this is also available in each visitor's state.opts
 * @param {string} workingDirectory
 */
export default (env, options, workingDirectory) => {
  /**
   * - This can receive the intermediate output of the old REGEX-based <template> transform:
   *   ```
   *   import { scopedClass } from 'ember-scoped-css';
   *
   *   __GLIMMER_TEMPLATE(`
   *     original <template> innards here
   *   `);
   *   ```
   *   - the import is optional, though, required for type-checking in gts (so we don't mess with globals)
   *   - the babel-plugin-ember-template-compilation step has not run yet,
   *     else we'd see precompileTemplate and setComponentTemplate (and more imports)
   *
   *   - note that in ember-template-imports' implementation, the file changes
   *     after `ImportDeclaration` visitors have ran, and by the time we see
   *     CallExpressions, we have the familiar `setComponentTemplate`
   */
  return {
    visitor: {
      Program: {
        enter(path, state) {
          if (!_isRelevantFile(state, workingDirectory)) {
            return;
          }

          state.importUtil = new ImportUtil(env, path);
        },
      },
      ImportDeclaration(path, state) {
        if (!_isRelevantFile(state, workingDirectory)) {
          return;
        }

        if (path.node.source.value === 'ember-scoped-css') {
          let specifier = path.node.specifiers.find(
            (x) => x.imported.name === 'scopedClass',
          );

          if (specifier) {
            state.file.opts.importedScopedClass = specifier.local.name;
          }

          if (specifier.local.name !== 'scopedClass') {
            throw new Error(
              `The scopedClass import is a psuedo-helper, and may not be renamed as it is removed at build time.`,
            );
          }

          path.remove();
        }
      },
      /**
       * Only in strict mode, do we care about remoning the scope bag reference
       */
      ObjectProperty(path, state) {
        if (!state.file.opts?.importedScopedClass) return;

        if (
          path.node.value.type === 'Identifier' &&
          path.node.value.name === state.file.opts?.importedScopedClass
        ) {
          path.remove();
        }
      },
      /**
       * If there is a CSS file, AND a corresponding template,
       * we can import the CSS to then defer to the CSS loader
       * or other CSS processing to handle the postfixing
       */
      CallExpression(path, state) {
        if (!_isRelevantFile(state, workingDirectory)) {
          return;
        }

        const node = path.node;

        if (
          node.callee.name === 'precompileTemplate' ||
          node.callee.name === 'hbs' ||
          node.callee.name === 'createTemplateFactory'
        ) {
          const fileName = state.file.opts.sourceFileName;

          let cssPath = cssPathFor(fileName);

          if (existsSync(cssPath)) {
            let baseCSS = nodePath.basename(cssPath);
            state.importUtil.importForSideEffect(`./${baseCSS}`);
          }
        }
      },
    },
  };
};
