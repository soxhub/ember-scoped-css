import postcss from 'postcss';
import parser from 'postcss-selector-parser';

import isInsideGlobal from './isInsideGlobal.js';

function getClassesAndTags(sel, classes, tags) {
  const transform = (sls) => {
    sls.walk((selector) => {
      if (selector.type === 'class' && !isInsideGlobal(selector)) {
        classes.add(selector.value);
      } else if (selector.type === 'tag' && !isInsideGlobal(selector)) {
        tags.add(selector.value);
      }
    });
  };

  parser(transform).processSync(sel);
}

export default function getClassesTagsFromCss(css) {
  const classes = new Set();
  const tags = new Set();

  const ast = postcss.parse(css);

  ast.walk((node) => {
    if (node.type === 'rule') {
      getClassesAndTags(node.selector, classes, tags);
    }
  });

  return { classes, tags };
}
