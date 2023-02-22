// const { createUnplugin } = require('unplugin');
const { basename } = require('path');
const fsExists = require('./fsExists');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');
// const path = require('path');

module.exports = async function (code) {
  const cssPath = this.resourcePath;
  const cssFileName = basename(cssPath);
  const postfix = getPostfix(cssFileName);

  if (code.includes(postfix)) {
    return code;
  }

  const hbsPath = cssPath.replace('.css', '.hbs');
  const gjsPath = cssPath.replace('.css', '.js');
  const hbsExists = await fsExists(hbsPath);
  const gjsExists = await fsExists(gjsPath);
  if (hbsExists || gjsExists) {
    const rewrittenCss = rewriteCss(code, postfix, cssFileName);
    return rewrittenCss;
  } else {
    return code;
  }
};
