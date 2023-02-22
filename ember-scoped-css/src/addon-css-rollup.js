const path = require('path');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');

module.exports = function ({ addonDir }) {
  return {
    name: 'addon-css-rollup',

    async resolveId(source, importer, options) {
      // catch emited css files
      if (source.endsWith('.css')) {
        return {
          external: true,
          id: importer.replace(/\.js$/, '.css'),
          meta: {
            importer,
          },
        };
      }
      return null;
    },

    generateBundle(a, bundle) {
      let scopedCss = '';
      for (let asset in bundle) {
        if (!asset.endsWith('css') || !bundle[asset.replace('css', 'js')]) {
          continue;
        }

        const cssFileName = path.basename(asset);
        const postfix = getPostfix(cssFileName);
        const rewrittenCss = rewriteCss(
          bundle[asset].source,
          postfix,
          cssFileName
        );
        scopedCss += rewrittenCss + '\n\n';
        bundle[asset].source = rewrittenCss;
      }
    },
  };
};
