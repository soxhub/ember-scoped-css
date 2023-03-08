const path = require('path');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');
const fsExists = require('./fsExists');

module.exports = function () {
  return {
    name: 'addon-rewritecss-rollup',

    async transform(code, id) {
      if (!id.endsWith('.css')) {
        return;
      }
      const postfix = getPostfix(id);
      const jsPath = id.replace(/\.css$/, '.gjs');
      const hbsPath = id.replace(/\.css$/, '.hbs');

      const [jsExists, hbsExists] = await Promise.all([
        fsExists(jsPath),
        fsExists(hbsPath),
      ]);

      if (jsExists || hbsExists) {
        const rewritten = rewriteCss(code, postfix, path.basename(id));
        return rewritten;
      }
    },
  };
};
