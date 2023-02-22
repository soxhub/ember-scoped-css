const { createUnplugin } = require('unplugin');
const path = require('path');
const { readFile, writeFile } = require('fs').promises;
const { Compilation } = require('webpack');
const getPostfix = require('./getPostfix');

module.exports = createUnplugin(({ appDir, loaders }) => {
  return {
    name: 'app-css-livereload-loader',

    transformInclude(id) {
      return id.endsWith('.js') || id.endsWith('.hbs');
    },

    async transform(code, jsPath) {
      if (process.env.EMBER_ENV === 'production') {
        return code;
      }

      const importRegex = /import\s+['"]([^'"]+\.css)['"]\s*;$/gm;
      let cssPaths = [];
      let match;
      while ((match = importRegex.exec(code))) {
        const importPath = match[1];
        const directory = path.dirname(jsPath);
        const cssPath = path.resolve(directory, importPath);
        cssPaths.push(cssPath);

        // replace import with empty string
        code = code.replace(match[0], '');
      }

      if (!cssPaths.length) {
        return code;
      }

      // const basePath = getCommonAncestor(appDir, jsPath);

      const promises = cssPaths.map(async (cssPath) => {
        let css = await readFile(cssPath, 'utf8');
        for (let i = loaders.length - 1; i >= 0; i--) {
          const loader = loaders[i];
          css = await loader.bind({ resourcePath: cssPath })(css);
        }
        // random string; lenght is 8
        const postfix = getPostfix(path.basename(cssPath));

        this.emitFile({
          type: 'asset',
          fileName:
            'assets/includedscripts/' + postfix + '_' + path.basename(cssPath),
          source: css,
        });
      });

      await Promise.all(promises);

      return code;
    },

    webpack(compiler) {
      if (process.env.EMBER_ENV === 'production') {
        return;
      }

      compiler.hooks.thisCompilation.tap('Replace', (compilation) => {
        compilation.hooks.processAssets.tapAsync(
          {
            name: 'Replace',
            stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED,
          },
          async (assets, callback) => {
            const cssAssets = Object.keys(assets).filter((asset) =>
              asset.startsWith('assets/includedscripts/')
            );

            const appCssPath = path.resolve(
              compiler.context,
              `assets/${path.basename(compiler.context)}.css`
            );

            const oldAppCss = await readFile(appCssPath, 'utf8');
            let appCss = oldAppCss;

            for (let asset of cssAssets) {
              // remove asset/ from asset name with path

              const newImport = `@import '${asset.replace('assets/', '')}';`;
              if (appCss.includes(newImport)) {
                continue;
              }
              appCss = `${newImport}\n\n${appCss}`;
            }

            if (oldAppCss !== appCss) {
              await writeFile(appCssPath, appCss, 'utf8');
            }

            callback();
          }
        );
      });
    },
  };
});
