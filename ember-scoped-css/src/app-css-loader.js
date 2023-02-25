// const { createUnplugin } = require('unplugin');
const { basename, join } = require('path');
const fsExists = require('./fsExists');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');
// const path = require('path');

module.exports = async function (code) {
  const cssPath = this.resourcePath;
  const cssFileName = basename(cssPath);
  const postfix = getPostfix(cssPath);

  const hbsPath = cssPath.replace('.css', '.hbs');
  const gjsPath = cssPath.replace('.css', '.js');
  const [hbsExists, gjsExists] = await Promise.all([
    fsExists(hbsPath),
    fsExists(gjsPath),
  ]);

  let rewrittenCss;
  if (hbsExists || gjsExists && cssPath.startsWith(this.rootContext)) {
    rewrittenCss = rewriteCss(code, postfix, cssFileName);
  } else {
    rewrittenCss = code;
  }

  return rewrittenCss;
};
