const path = require('path');
const { readFileSync, existsSync } = require('fs');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');
const replaceHbsInJs = require('./replaceHbsInJs');
const getClassesTagsFromCss = require('./getClassesTagsFromCss');
const rewriteHbs = require('./rewriteHbs');

module.exports = function rollupCssColocation(options = {}) {
  return {
    name: 'addon-hbs-rollup',

    transform(code, id) {
      if (id.endsWith('.hbs.js')) {
        const hbsPath = id.replace('.js', '');
        const cssPath = hbsPath.replace('.hbs', '.css');

        if (existsSync(cssPath)) {
          // read the css file
          const css = readFileSync(cssPath, 'utf-8');
          const { classes, tags } = getClassesTagsFromCss(css);

          // generate unique postfix
          const fileName = path.basename(cssPath);
          const postfix = getPostfix(fileName);

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
