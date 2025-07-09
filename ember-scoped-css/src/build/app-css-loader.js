// import { createUnplugin }  from 'unplugin';
import path from 'node:path';

import {
  cssHasAssociatedComponent,
  hashFrom,
  isRelevantFile,
} from '../lib/path/utils.js';
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

  if (cssHasAssociatedComponent(cssPath)) {
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
