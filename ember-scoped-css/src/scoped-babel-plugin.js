import { existsSync, readFileSync } from 'fs';
import nodePath from 'path';

import { packageScopedPathToModulePath } from './lib/generateAbsolutePathHash.js';
import generateHash from './lib/generateRelativePathHash.js';
import getClassesTagsFromCss from './lib/getClassesTagsFromCss.js';
import rewriteHbs from './lib/rewriteHbs.js';

export default () => {
  return {
    visitor: {
      Program(path, state) {
        console.log(path);
      },
      CallExpression(path, state) {
        /**
         * Mostly pods support.
         * folks need to opt in to pods, because every pods app can be configured differently
         */
        let roots = ['/components/', ...(state.opts?.additionalRoots || [])];
        let filename = state.file.opts.filename;

        if (!roots.some((root) => filename.includes(root))) {
          return;
        }

        const node = path.node;

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
              );
            }
          }
        }
      },
    },
  };
};
