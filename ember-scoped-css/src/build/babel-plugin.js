import { existsSync, readFileSync } from 'fs';
import nodePath from 'path';

import getClassesTagsFromCss from '../lib/getClassesTagsFromCss.js';
import {
  cssPathFor,
  hashFromModulePath,
  isRelevantFile,
  packageScopedPathToModulePath,
} from '../lib/path/utils.js';
import rewriteHbs from '../lib/rewriteHbs.js';

function _isRelevantFile(state) {
  let fileName = state.file.opts.filename;
  let additionalRoots = state.opts?.additionalRoots;

  return isRelevantFile(fileName, additionalRoots);
}

export default () => {
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
      ImportDeclaration(path, state) {
        if (!_isRelevantFile(state)) {
          return;
        }

        if (path.node.source.value === 'ember-scoped-css') {
          let specifier = path.node.specifiers.find(
            (x) => x.imported.name === 'scopedClass',
          );

          if (specifier) {
            state.file.opts.importedScopedClass = specifier.local.name;
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
      CallExpression(path, state) {
        if (!_isRelevantFile(state)) {
          return;
        }

        const node = path.node;
        const importedScopedClass = state.file.opts?.importedScopedClass;

        if (
          node.callee.name === 'precompileTemplate' ||
          node.callee.name === 'hbs'
        ) {
          // check if css exists
          const relativeFileName =
            'app' +
            state.file.opts.sourceFileName.substring(
              state.file.opts.sourceFileName.indexOf('/'),
            );
          const fileName = nodePath.join(
            state.file.opts.root,
            relativeFileName,
          );

          let cssPath = cssPathFor(fileName);

          if (existsSync(cssPath)) {
            const css = readFileSync(cssPath, 'utf8');
            const { classes, tags } = getClassesTagsFromCss(css);

            let localPackagerStylePath = packageScopedPathToModulePath(
              state.file.opts.sourceFileName,
            );
            const postfix = hashFromModulePath(localPackagerStylePath);

            if (node.arguments[0].type === 'TemplateLiteral') {
              node.arguments[0].quasis[0].value.raw = rewriteHbs(
                node.arguments[0].quasis[0].value.raw,
                classes,
                tags,
                postfix,
                importedScopedClass,
              );
              node.arguments[0].quasis[0].value.cooked =
                node.arguments[0].quasis[0].value.raw;
            } else if (
              node.arguments[0].type === 'StringLiteral' ||
              node.arguments[0].type === 'Literal'
            ) {
              node.arguments[0].value = rewriteHbs(
                node.arguments[0].value,
                classes,
                tags,
                postfix,
                importedScopedClass,
              );
            }
          }
        }
      },
    },
  };
};
