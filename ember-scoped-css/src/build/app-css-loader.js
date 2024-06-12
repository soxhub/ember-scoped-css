// import { createUnplugin }  from 'unplugin';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { hashFrom, isRelevantFile } from '../lib/path/utils.js';
import rewriteCss from '../lib/rewriteCss.js';

export default async function (code) {
  const options = this.getOptions();
  const cssPath = this.resourcePath;

  if (!isRelevantFile(cssPath, { ...options, cwd: this.rootContext })) {
    return code;
  }

  if (!cssPath.startsWith(this.rootContext)) {
    return code;
  }

  const cssFileName = path.basename(cssPath);

  const hbsPath = cssPath.replace('.css', '.hbs');
  const gjsPath = cssPath.replace('.css', '.js');
  const hbsExists = existsSync(hbsPath);
  const gjsExists = existsSync(gjsPath);

  if (hbsExists || gjsExists) {
    const postfix = hashFrom(cssPath);
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
