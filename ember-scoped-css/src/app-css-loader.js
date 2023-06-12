// import { createUnplugin }  from 'unplugin';
import { basename } from 'path';

import fsExists from './lib/fsExists.js';
import generateHash from './lib/generateAbsolutePathHash.js';
import rewriteCss from './lib/rewriteCss.js';
// import path  from 'path';

export default async function (code) {
  const cssPath = this.resourcePath;
  const cssFileName = basename(cssPath);
  const postfix = generateHash(cssPath);

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
