import { createUnplugin } from 'unplugin';
import { readFile } from 'fs/promises';
import path from 'path';
import getClassesTagsFromCss from './getClassesTagsFromCss.js';
import getPostfix from './getPostfix.js';
import replaceHbsInJs from './replaceHbsInJs.js';
import rewriteHbs from './rewriteHbs.js';
import fsExists from './fsExists.js';
import findCssInJs from './findCssInJs.js';
import recast from 'recast';

export default createUnplugin(() => {
  return {
    name: 'addon-js-unplugin',

    transformInclude(id) {
      return id.endsWith('.js') || id.endsWith('.ts');
    },

    async transform(code, jsPath) {
      const cssPath = jsPath.replace(/(\.hbs)?\.((js)|(ts))$/, '.css');
      const cssFileName = path.basename(cssPath);

      const cssExists = await fsExists(cssPath);
      let css;
      if (cssExists) {
        css = await readFile(cssPath, 'utf8');
      } else {
        if (code.includes('__GLIMMER_STYLES')) {
          const result = findCssInJs(code, true);
          css = result.css;
          code = recast.print(result.ast).code;
          this.getModuleInfo(jsPath).meta.gjsCss = result.css;

          // TODO: generate changed source map. Implementation depends on implemented rollup plugin for style tag
        }
      }

      if (!css) {
        return {
          code,
          map: null,
        };
      }

      // add css import for js and gjs files
      code = `import './${cssFileName}';\n\n${code}`;

      // rewrite hbs in js in case it is gjs file (for gjs files hbs is already in js file)
      // for js components "@embroider/addon-dev/template-colocation-plugin", will add hbs to js later. So there is hbs plugin to rewrite hbs

      const rewrittenCode = replaceHbsInJs(code, (hbs) => {
        const { classes, tags } = getClassesTagsFromCss(css);
        const postfix = getPostfix(cssPath);
        const rewritten = rewriteHbs(hbs, classes, tags, postfix);
        return rewritten;
      });

      return {
        code: rewrittenCode,
        map: null,
      };
    },
  };
});
