const fs = require('fs');
const p = require('path');
const template = require('@babel/template').default;

const importCssPlugin = () => {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          const cssFilePath = state.file.opts.filename.replace(
            /(\.hbs)?\.(js|ts|gjs|gts|hbs|hb)$/,
            '.css'
          );

          if (fs.existsSync(cssFilePath)) {
            const fileName = p.basename(cssFilePath);
            const importStatement = `import './${fileName}';\n`;
            const importNode = template.ast(importStatement);
            path.node.body.unshift(importNode);
          }
        },
      },
    },
  };
};

module.exports = importCssPlugin;
