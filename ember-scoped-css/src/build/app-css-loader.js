// import { createUnplugin }  from 'unplugin';
import path from 'node:path';

import { exists, hashFromModulePath } from '../lib/path/utils.js';
import rewriteCss from '../lib/rewriteCss.js';

export default async function (code) {
  const options = this.getOptions();
  const cssPath = this.resourcePath;
  const cssFileName = path.basename(cssPath);

  const postfix = hashFromModulePath(cssPath);

  const hbsPath = cssPath.replace('.css', '.hbs');
  const gjsPath = cssPath.replace('.css', '.js');
  const [hbsExists, gjsExists] = await Promise.all([
    exists(hbsPath),
    exists(gjsPath),
  ]);

  let rewrittenCss;

  if (hbsExists || (gjsExists && cssPath.startsWith(this.rootContext))) {
    rewrittenCss = rewriteCss(code, postfix, cssFileName, options.layerName);
  } else {
    rewrittenCss = code;
  }

  return rewrittenCss;
}
