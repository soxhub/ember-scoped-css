import rewriteHbs from './lib/rewriteHbs.js';
import generateHash from './lib/generateRelativePathHash.js';
import { readFileSync, existsSync } from 'fs';
import getClassesTagsFromCss from './lib/getClassesTagsFromCss.js';
import nodePath from 'path';

export default function scopedClass() {
  return {
    visitor: {
      CallExpression(path, state) {
        if (!state.file.opts.filename.includes('/components/')) {
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
              state.file.opts.sourceFileName.indexOf('/')
            );
          const fileName = nodePath.join(
            state.file.opts.root,
            relativeFileName
          );

          const cssPath = fileName.replace(/(\.js)|(\.ts)/, '.css');
          if (existsSync(cssPath)) {
            const css = readFileSync(cssPath, 'utf8');
            const { classes, tags } = getClassesTagsFromCss(css);

            console.log('generateHash',
              state.file.opts.sourceFileName.replace(/(\.js)|(\.ts)/, '.css'));

            const postfix = generateHash(
              state.file.opts.sourceFileName.replace(/(\.js)|(\.ts)/, '.css')
            );
            if (node.arguments[0].type === 'TemplateLiteral') {
              node.arguments[0].quasis[0].value.raw = rewriteHbs(
                node.arguments[0].quasis[0].value.raw,
                classes,
                tags,
                postfix
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
                postfix
              );
            }
          }
        }
      },
    },
  };
}
