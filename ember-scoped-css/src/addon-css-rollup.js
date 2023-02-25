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

        const regex = /@import\s+["']?([^"')]+)["']?;/g;
        let match;

        while ((match = regex.exec(css))) {
          const importPath = match[1];
          if (!importPath.includes('http') && !importPath.startsWith('url(')) {
            const resolution = await this.resolve(importPath, id);
            resolution.meta.internalImport = true;
            const importedCss = await this.load(resolution);
            let ic = importedCss.code.substring(9);
            ic = ic.substring(0, ic.length - 2);
            css = css.replace(match[0], JSON.parse(ic));
          }
        }

        return css;
      }
      return null;
    },

    async transform(code, id) {
      if (id.endsWith('.css')) {
        if (this.getModuleInfo(id).meta.internalImport) {
          return `var a = '${JSON.stringify(code)}';`;
        } else {
          this.emitFile({
            type: 'asset',
            fileName: id.replace(path.join(addonDir, 'src/'), ''),
            source: code,
          });
          // return `import '!./${path.basename(id)}';`;
          return '';
        }
      }
    },

    generateBundle(a, bundle) {
      let scopedCss = '';
      for (let asset in bundle) {
        if (!asset.endsWith('js') || !bundle[asset.replace('js', 'css')]) {
          continue;
        }

        bundle[asset].code =
          `import './${path.basename(asset.replace('.js', '.css'))}';\n` +
          bundle[asset].code;

        // TODO store css in meta for that module!!!!!!
      }
    },
  };
};
