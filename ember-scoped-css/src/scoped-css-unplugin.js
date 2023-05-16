import { createUnplugin } from 'unplugin';
import { readFile } from 'fs/promises';
import path from 'path';
import getClassesTagsFromCss from './lib/getClassesTagsFromCss.js';
import generateHash from './lib/generateAbsolutePathHash.js';
import replaceHbsInJs from './lib/replaceHbsInJs.js';
import rewriteHbs from './lib/rewriteHbs.js';
import fsExists from './lib/fsExists.js';
import rewriteCss from './lib/rewriteCss.js';

function isJsFile(id) {
  return id.endsWith('.js') || id.endsWith('.ts');
}

function isCssFile(id) {
  return id.endsWith('.css');
}

async function transformJsFile(code, jsPath) {
  const cssPath = jsPath.replace(/(\.hbs)?\.((js)|(ts))$/, '.css');
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

  const rewrittenCode = replaceHbsInJs(code, (hbs) => {
    const { classes, tags } = getClassesTagsFromCss(css);
    const postfix = generateHash(cssPath);
    const rewritten = rewriteHbs(hbs, classes, tags, postfix);
    return rewritten;
  });

  return {
    code: rewrittenCode,
    map: null,
  };
}

async function transformCssFile(code, id, emitFile) {
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
    code = rewriteCss(code, postfix, path.basename(id));
  }

  emitFile({
    type: 'asset',
    fileName: id.replace(path.join(process.cwd(), 'src/'), ''),
    source: code,
  });
  return '';
}

export default createUnplugin(() => {
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
          // add import to js files
          bundle[asset].code =
            `import './${path.basename(asset.replace('.js', '.css'))}';\n` +
            bundle[asset].code;
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
      if (isJsFile(jsPath)) {
        return transformJsFile(code, jsPath);
      } else if (isCssFile(jsPath)) {
        return transformCssFile(code, jsPath, this.emitFile);
      }
    },
  };
});