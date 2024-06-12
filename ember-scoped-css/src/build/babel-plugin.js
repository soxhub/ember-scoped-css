import { ImportUtil } from 'babel-import-util';
import { existsSync } from 'fs';
import nodePath from 'path';

import { cssPathFor, isRelevantFile } from '../lib/path/utils.js';

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
   * This babel plugin does two things:
   * - removes the import of scopedClass, if it exists
   * - adds an import to the CSS file, if it exists
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
