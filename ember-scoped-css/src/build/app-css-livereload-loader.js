import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createUnplugin } from 'unplugin';
import { Compilation } from 'webpack';

import generateHash from '../lib/generateAbsolutePathHash.js';

export default createUnplugin(({ loaders, htmlEntrypointInfo }) => {
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

      const promises = cssPaths.map(async (cssPath) => {
        let css = await readFile(cssPath, 'utf8');

        for (let i = loaders.length - 1; i >= 0; i--) {
          const loader = loaders[i];

          css = await loader.bind({ resourcePath: cssPath })(css);
        }

        // random string; lenght is 8
        const postfix = generateHash(path.basename(cssPath));

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
            try {
              const cssAssets = Object.keys(assets).filter((asset) =>
                asset.startsWith('assets/includedscripts/'),
              );

              if (!cssAssets.length) {
                return;
              }

              // let linkAdded = false;
              const document =
                htmlEntrypointInfo.htmlEntryPoint.dom.window.document;

              for (let asset of cssAssets) {
                const head = document.getElementsByTagName('head')[0];
                const linkExists = head.querySelector(
                  `link[rel="stylesheet"][href="/${asset}"]`,
                );

                if (!linkExists) {
                  const link = document.createElement('link');

                  link.rel = 'stylesheet';
                  link.href = '/' + asset;
                  head.appendChild(link);
                  // linkAdded = true;
                }
              }

              // if (linkAdded) {
              //   const indexHtmlWithLinks = dom.serialize();
              //   await writeFile(indexHtmlPath, indexHtmlWithLinks, 'utf8');
              // }
            } finally {
              callback();
            }
          },
        );
      });
    },
  };
});
