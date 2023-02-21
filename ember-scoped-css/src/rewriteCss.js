const parser = require('postcss-selector-parser');
const postcss = require('postcss');

function rewriteSelector(sel, postfix) {
  const transform = (selectors) => {
    selectors.walk((selector) => {
      if (selector.type === 'class') {
        selector.value += '_' + postfix;
      } else if (selector.type === 'tag') {
        selector.replaceWith(
          parser.tag({ value: selector.value }),
          parser.className({ value: postfix })
        );
      }
    });
  };
  const transformed = parser(transform).processSync(sel);
  return transformed;
}

module.exports = function rewriteCss(css, postfix, fileName) {
  const ast = postcss.parse(css);
  ast.walk((node) => {
    if (node.type === 'rule') {
      node.selector = rewriteSelector(node.selector, postfix);
    }
  });

  const rewrittenCss = ast.toString();
  return `/* ${fileName} */\n@layer components {\n\n` + rewrittenCss + '\n}\n';
  // return `/* ${fileName} */\n ${rewrittenCss}`;
};
