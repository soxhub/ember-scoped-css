const { readFile } = require('fs').promises;
const getPostfix = require('./getPostfix');
const replaceHbsInJs = require('./replaceHbsInJs');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteHbs = require('./rewriteHbs');
const fsExists = require('./fsExists');

module.exports = function rollupCssColocation(options = {}) {
  return {
    name: 'addon-hbs-rollup',

    async transform(code, id) {
      if (id.endsWith('.hbs.js')) {
        const hbsPath = id.replace('.js', '');
        const cssPath = hbsPath.replace('.hbs', '.css');

        const cssExists = await fsExists(cssPath);
        if (cssExists) {
          // read the css file
          // TODO: get css from loader, because there are classes in imported css files; css can be stored in meta!!!!!
          // const resolution = await this.resolve(importPath, id);
          //   resolution.meta.internalImport = true;
          //   const importedCss = await this.load(resolution);
          const css = await readFile(cssPath, 'utf-8');
          const { classes, tags } = getClassesTagsFromCss(css);

          // generate unique postfix
          const postfix = getPostfix(cssPath);

          // rewrite the template
          const rewrittenHbsJs = replaceHbsInJs(code, (hbs) => {
            // add dependency to the css file
            this.addWatchFile(cssPath);
            return rewriteHbs(hbs, classes, tags, postfix);
          });

          return rewrittenHbsJs;
        }
      }
    },
  };
};
