import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { createUnplugin } from 'unplugin';

import fsExists from '../lib/fsExists.js';
import generateHash from '../lib/generateAbsolutePathHash.js';
import getClassesTagsFromCss from '../lib/getClassesTagsFromCss.js';
import replaceHbsInJs from '../lib/replaceHbsInJs.js';
import rewriteCss from '../lib/rewriteCss.js';
import rewriteHbs from '../lib/rewriteHbs.js';

function isJsFile(id) {
  return (
    id.endsWith('.js') ||
    id.endsWith('.ts') ||
    id.endsWith('.gjs') ||
    id.endsWith('.gts')
  );
}

function isHbsFile(id) {
  return id.endsWith('.hbs');
}

function isCssFile(id) {
  return id.endsWith('.css');
}

async function transformJsFile(code, id) {
  const cssPath = id.endsWith('.hbs')
    ? id.replace(/\.hbs$/, '.css')
    : id.replace(/(\.hbs)?\.(js|ts|gjs|gts)$/, '.css');
  const cssFileName = path.basename(cssPath);

  const cssExists = await fsExists(cssPath);
  let css;

  if (cssExists) {
    css = await readFile(cssPath, 'utf8');
  } else {
    return {
      code,
      map: null,
    };
  }

  // add css import for js and gjs files
  code = `import './${cssFileName}';\n\n${code}`;

  // rewrite hbs in js in case it is gjs file (for gjs files hbs is already in js file)

  const rewrittenCode = replaceHbsInJs(code, (hbs, scopedClass) => {
    const { classes, tags } = getClassesTagsFromCss(css);
    const postfix = generateHash(cssPath);
    const rewritten = rewriteHbs(hbs, classes, tags, postfix, scopedClass);

    return rewritten;
  });

  return {
    code: rewrittenCode,
    map: null,
  };
}

async function transformCssFile(code, id, layerName, emitFile) {
  const jsPath = id.replace(/\.css$/, '.gjs');
  const gtsPath = id.replace(/\.css$/, '.gts');
  const hbsPath = id.replace(/\.css$/, '.hbs');

  const [jsExists, gtsExists, hbsExists] = await Promise.all([
    fsExists(jsPath),
    fsExists(gtsPath),
    fsExists(hbsPath),
  ]);

  if (jsExists || hbsExists || gtsExists) {
    const postfix = generateHash(id);

    code = rewriteCss(code, postfix, path.basename(id), layerName);
  }

  const emittedFileName = id.replace(path.join(process.cwd(), 'src/'), '');

  emitFile({
    type: 'asset',
    fileName: emittedFileName,
    source: code,
  });

  return '';
}

export default createUnplugin(
  /**
   * @typedef {object} Options
   * @property {string} [layerName] the name of the layer to place the generated css. Defaults to "components"
   *
   * @param {Options} [options]
   */
  (options) => {
    return {
      name: 'ember-scoped-css-unplugin',

      generateBundle(a, bundle) {
        let cssFiles = [];

        for (let asset in bundle) {
          const cssAsset = asset.replace('js', 'css');

          if (!asset.endsWith('js') || !bundle[cssAsset]) {
            continue;
          }

          if (process.env.environment === 'development') {
            cssFiles.push(bundle[cssAsset].source);
            delete bundle[cssAsset];
          } else {
            const cssImport = path.basename(asset.replace('.js', '.css'));
            const importLine = `import './${cssImport}';`;

            // add import to js files
            if (bundle[asset].code.indexOf(importLine) < 0) {
              bundle[asset].code = `${importLine}\n` + bundle[asset].code;
            }
          }
        }

        if (process.env.environment === 'development') {
          this.emitFile({
            type: 'asset',
            fileName: 'scoped.css',
            source: cssFiles.join('\n'),
          });
        }
      },

      transform(code, jsPath) {
        /**
         * HBS files are actually JS files with a call to precompileTemplate
         */
        if (isHbsFile(jsPath)) {
          return transformJsFile(code, jsPath);
        } else if (isJsFile(jsPath)) {
          return transformJsFile(code, jsPath);
        } else if (isCssFile(jsPath)) {
          return transformCssFile(
            code,
            jsPath,
            options?.layerName,
            this.emitFile,
          );
        }
      },
    };
  },
);
