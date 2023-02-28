const path = require('path');
const getPostfix = require('./getPostfix');
const rewriteCss = require('./rewriteCss');
const { readFile } = require('fs').promises;
const fsExists = require('./fsExists');
const findCssInJs = require('./findCssInJs');
const getImportedCssFiles = require('./getImportedCssFiles');
const recast = require('recast');

module.exports = function ({ addonDir }) {
  return {
    name: 'addon-css-rollup',

    async resolveId(source, importer, options) {
      // catch emited css files
      if (source.endsWith('.css')) {
        const resolution = await this.resolve(source, importer, {
          ...options,
          skipSelf: true,
        });

        if (resolution) {
          return resolution;
        } else {
          const gjsCss = this.getModuleInfo(importer)?.meta?.gjsCss;
          if (gjsCss) {
            return {
              external: false,
              id: importer.replace(/\.js$/, '.css'),
              meta: {
                importer,
                gjsCss,
              },
            };
          }
        }
      }
      return null;
    },

    async load(id) {
      if (id.endsWith('.css')) {
        const gjsCss = this.getModuleInfo(id).meta.gjsCss;
        let css = gjsCss;
        if (!css) {
          css = await readFile(id, 'utf-8');
        }

        return css;
      }
    },

    async transform(code, id) {
      if (id.endsWith('.css')) {
        this.emitFile({
          type: 'asset',
          fileName: id.replace(path.join(addonDir, 'src/'), ''),
          source: code,
        });
        return '';
      }
    },

    generateBundle(a, bundle) {
      let cssFiles = [];
      for (let asset in bundle) {
        const cssAsset = asset.replace('js', 'css');
        if (!asset.endsWith('js') || !bundle[cssAsset]) {
          continue;
        }

        if (process.env.environment === 'development') {
          cssFiles.push(bundle[cssAsset].source);
          delete bundle[cssAsset];
        } else {
          // add import to js files
          bundle[asset].code =
            `import './${path.basename(asset.replace('.js', '.css'))}';\n` +
            bundle[asset].code;
        }
      }

      if (process.env.environment === 'development') {
        this.emitFile({
          type: 'asset',
          fileName: 'scoped.css',
          source: cssFiles.join('\n'),
        });
      }
    },
  };
};
