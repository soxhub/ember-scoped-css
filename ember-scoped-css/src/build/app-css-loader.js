// import { createUnplugin }  from 'unplugin';
import path from 'node:path';

import { exists, hashFromModulePath } from '../lib/path/utils.js';
import rewriteCss from '../lib/rewriteCss.js';

export default async function (code) {
  const options = this.getOptions();
  const cssPath = this.resourcePath;

  if (!cssPath.startsWith(this.rootContext)) {
    return code;
  }

  const cssFileName = path.basename(cssPath);

  const hbsPath = cssPath.replace('.css', '.hbs');
  const gjsPath = cssPath.replace('.css', '.js');
  const [hbsExists, gjsExists] = await Promise.all([
    exists(hbsPath),
    exists(gjsPath),
  ]);

  if (hbsExists || gjsExists) {
    const postfix = hashFromModulePath(cssPath);
    const rewrittenCss = rewriteCss(
      code,
      postfix,
      cssFileName,
      options.layerName,
    );

    return rewrittenCss;
  }

  return code;
}
