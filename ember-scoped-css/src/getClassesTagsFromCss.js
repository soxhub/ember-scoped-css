const postcss = require('postcss');
const parser = require('postcss-selector-parser');

function getClassesAndTags(sel, classes, tags) {
  const transform = (sls) => {
    sls.walk((selector) => {
      if (selector.type === 'class') {
        classes.add(selector.value);
      } else if (selector.type === 'tag') {
        tags.add(selector.value);
      }
    });
  };

  parser(transform).processSync(sel);
}

module.exports = function getClassesTagsFromCss(css) {
  const classes = new Set();
  const tags = new Set();

  const ast = postcss.parse(css);
  ast.walk((node) => {
    if (node.type === 'rule') {
      getClassesAndTags(node.selector, classes, tags);
    }
  });

  return { classes, tags };
};
