import path from 'path';
import getPostfix from './getPostfix.js';
import rewriteCss from './rewriteCss.js';
import fsExists from './fsExists.js';

export default function () {
  return {
    name: 'addon-rewritecss-rollup',

    async transform(code, id) {
      if (!id.endsWith('.css')) {
        return;
      }
      const postfix = getPostfix(id);
      const jsPath = id.replace(/\.css$/, '.gjs');
      const gtsPath = id.replace(/\.css$/, '.gts');
      const hbsPath = id.replace(/\.css$/, '.hbs');

      const [jsExists, gtsExists, hbsExists] = await Promise.all([
        fsExists(jsPath),
        fsExists(gtsPath),
        fsExists(hbsPath),
      ]);

      if (jsExists || hbsExists || gtsExists) {
        const rewritten = rewriteCss(code, postfix, path.basename(id));
        return rewritten;
      }
    },
  };
}
