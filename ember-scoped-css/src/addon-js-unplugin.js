const { createUnplugin } = require('unplugin');
const { readFile } = require('fs').promises;
const path = require('path');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const getPostfix = require('./getPostfix');
const replaceHbsInJs = require('./replaceHbsInJs');
const rewriteHbs = require('./rewriteHbs');
const fsExists = require('./fsExists');

module.exports = createUnplugin((options) => {
  return {
    name: 'addon-js-unplugin',

    transformInclude(id) {
      return id.endsWith('.js');
    },

    async transform(code, jsPath) {
      const cssPath = jsPath.replace(/\.js$/, '.css');
      const cssFileName = path.basename(cssPath);

      const cssExists = await fsExists(cssPath);
      let css;
      if (cssExists) {
        css = await readFile(cssPath, 'utf8');
      } else {
        // it could check if there is emited css file (I don't know how to do it)
        const gjsPath = jsPath.replace(/\.js$/, '.gjs');
        const gjsExists = await fsExists(gjsPath);
        if (!gjsExists) {
          return code;
        }
        const gjs = await readFile(gjsPath, 'utf8');
        const styleRegex = /<style>([\s\S]*?)<\/style>/g;
        const styleMatch = styleRegex.exec(gjs);
        if (!styleMatch) {
          return code;
        }
        css = styleMatch[1];
      }

      // add css import for js and gjs files
      code = `import './${cssFileName}';\n\n${code}`;

      // rewrite hbs in js in case it is gjs file (for gjs files hbs is already in js file)
      // for js components "@embroider/addon-dev/template-colocation-plugin", will add hbs to js later. So there is hbs plugin to rewrite hbs

      return replaceHbsInJs(code, (hbs) => {
        const { classes, tags } = getClassesTagsFromCss(css);
        const postfix = getPostfix(cssFileName);
        const rewritten = rewriteHbs(hbs, classes, tags, postfix);
        return rewritten;
      });
    },
  };
});
