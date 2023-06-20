import postcss from 'postcss';
import parser from 'postcss-selector-parser';

import isInsideGlobal from './isInsideGlobal.js';

function rewriteSelector(sel, postfix) {
  const transform = (selectors) => {
    selectors.walk((selector) => {
      if (selector.type === 'class' && !isInsideGlobal(selector)) {
        selector.value += '_' + postfix;
      } else if (selector.type === 'tag' && !isInsideGlobal(selector)) {
        selector.replaceWith(
          parser.tag({ value: selector.value }),
          parser.className({ value: postfix })
        );
      }
    });

    // remove :global
    selectors.walk((selector) => {
      if (selector.type === 'pseudo' && selector.value === ':global') {
        selector.replaceWith(...selector.nodes);
      }
    });
  };
  const transformed = parser(transform).processSync(sel);

  return transformed;
}

function isInsideKeyframes(node) {
  const parent = node.parent;

  if (!parent) return false;
  if (parent.type === 'atrule' && parent.name === 'keyframes') return true;

  return isInsideKeyframes(parent);
}

export default function rewriteCss(css, postfix, fileName, layerName) {
  const layerNameWithDefault = layerName ?? 'components';
  const ast = postcss.parse(css);

  ast.walk((node) => {
    if (node.type === 'rule' && !isInsideKeyframes(node)) {
      node.selector = rewriteSelector(node.selector, postfix);
    }
  });

  const rewrittenCss = ast.toString();

  if (!layerNameWithDefault) {
    return `/* ${fileName} */\n${rewrittenCss}\n`;
  }

  return (
    `/* ${fileName} */\n@layer ${layerNameWithDefault} {\n\n` +
    rewrittenCss +
    '\n}\n'
  );
}
