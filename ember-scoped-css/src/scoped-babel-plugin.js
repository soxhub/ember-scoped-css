import { existsSync, readFileSync } from 'fs';
import nodePath from 'path';

import { packageScopedPathToModulePath } from './lib/generateAbsolutePathHash.js';
import generateHash from './lib/generateRelativePathHash.js';
import getClassesTagsFromCss from './lib/getClassesTagsFromCss.js';
import rewriteHbs from './lib/rewriteHbs.js';

function isRelevantFile(state) {
   /**
         * Mostly pods support.
         * folks need to opt in to pods, because every pods app can be configured differently
         */
   let roots = ['/components/', ...(state.opts?.additionalRoots || [])];
   let filename = state.file.opts.filename;

   if (!roots.some((root) => filename.includes(root))) {
     return;
   }

   return true;
}

/**
 * This babel plugin runs on AMD code
 */
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
        if (!isRelevantFile(state)) {
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
          // path.stop();
        }
      },
      CallExpression(path, state) {
        if (!isRelevantFile(state)) {
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

          let cssPath = fileName.replace(/(\.js)|(\.ts)/, '.css');

          /**
           * Pods support
           *
           * components + pods will never be supported.
           */
          let isPod =
            !fileName.includes('/components/') &&
            fileName.endsWith('template.js');

          if (isPod) {
            cssPath = fileName.replace(/template\.js$/, 'styles.css');
          }

          if (existsSync(cssPath)) {
            const css = readFileSync(cssPath, 'utf8');
            const { classes, tags } = getClassesTagsFromCss(css);

            let localPackagerStylePath = packageScopedPathToModulePath(
              state.file.opts.sourceFileName,
            );
            const postfix = generateHash(localPackagerStylePath);

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
