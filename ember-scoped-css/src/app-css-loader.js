// import { createUnplugin }  from 'unplugin';
import { basename } from 'path';
import fsExists from './fsExists.js';
import getPostfix from './getPostfix.js';
import rewriteCss from './rewriteCss.js';
// import path  from 'path';

export default async function (code) {
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
  if (hbsExists || (gjsExists && cssPath.startsWith(this.rootContext))) {
    rewrittenCss = rewriteCss(code, postfix, cssFileName);
  } else {
    rewrittenCss = code;
  }

  return rewrittenCss;
}
