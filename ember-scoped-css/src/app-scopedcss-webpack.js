// const { RawSource } = require('webpack-sources');
const rewriteCss = require('./rewriteCss');
const { readFile, writeFile } = require('fs').promises;
const glob = require('glob');
const path = require('path');
const getPostfix = require('./getPostfix');
const fsExists = require('./fsExists');

function getFiles(globPath) {
  return new Promise((resolve, reject) => {
    glob(globPath, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
}

module.exports = class {
  apply(compiler) {
    if (process.env.EMBER_ENV === 'production') {
      return;
    }

    compiler.hooks.emit.tapAsync(
      'scoped-webpack-plugin',
      async (compilation, callback) => {
        try {
          const cssFiles = await getFiles(
            path.resolve(compiler.context, '**/*.css')
          );

          // Rewrite the CSS files
          const rewrittenFiles = [];
          // const rewritenFiles = cssFiles.map((file) => {
          for (let file of cssFiles) {
            if (file.endsWith(`/${path.basename(compiler.context)}.css`)) {
              // import scoped.css into app.css
              let appCss = await readFile(file, 'utf-8');
              await writeFile(file, `@import "scoped.css";\n${appCss}`);
            }

            if (
              [
                path.basename(compiler.context) + '.css',
                'test-support.css',
              ].some((f) => file.endsWith(f)) ||
              file.includes('/vendor/') ||
              !(
                (await fsExists(file.replace('.css', '.js'))) ||
                (await fsExists(file.replace('.css', '.hbs')))
              )
            ) {
              continue;
            }
            const fileName = path.basename(file);
            const postfix = getPostfix(fileName);
            const css = await readFile(file, 'utf-8');
            const rewrittenCss = rewriteCss(css, postfix, fileName);

            rewrittenFiles.push(rewrittenCss);
          }

          // Concatenate the rewritten CSS files
          let concatenatedCSS = rewrittenFiles.join('\n\n');

          // Store the concatenated CSS in the assets/scoped-components.css
          compilation.assets['assets/scoped.css'] = {
            source: () => concatenatedCSS,
            size: () => concatenatedCSS.length,
          };
        } finally {
          callback();
        }
      }
    );
  }
};
