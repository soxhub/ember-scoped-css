const { createUnplugin } = require('unplugin');
const { basename } = require('path');
const fsExists = require('./fsExists');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');
const path = require('path');

module.exports = createUnplugin(({ appDir }) => {
  return {
    enforce: 'pre',
    name: 'app-css-unplugin',

    transformInclude(id) {
      return id.includes(path.basename(appDir)) && id.endsWith('.css');
    },

    async transform(code, cssPath) {
      const hbsPath = cssPath.replace('.css', '.hbs');
      const gjsPath = cssPath.replace('.css', '.js');
      const hbsExists = await fsExists(hbsPath);
      const gjsExists = await fsExists(gjsPath);
      if (hbsExists || gjsExists) {
        const cssFileName = basename(cssPath);
        const postfix = getPostfix(cssFileName);
        const rewrittenCss = rewriteCss(code, postfix, cssFileName);
        return rewrittenCss;
      } else {
        return code;
      }
    },
  };
});
