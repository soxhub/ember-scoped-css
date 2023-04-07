const recast = require('ember-template-recast');
const renameClass = require('./renameClass');

module.exports = function rewriteHbs(hbs, classes, tags, postfix) {
  let ast = recast.parse(hbs);

  recast.traverse(ast, {
    AttrNode(node) {
      if (node.name === 'class') {
        if (node.value.type === 'TextNode' && node.value.chars) {
          const renamedClass = renameClass(node.value.chars, postfix, classes);
          node.value.chars = renamedClass;
        } else if (node.value.type === 'ConcatStatement') {
          for (let part of node.value.parts) {
            if (part.type === 'TextNode' && part.chars) {
              const renamedClass = renameClass(part.chars, postfix, classes);
              part.chars = renamedClass;
            }
          }
        }
      }
    },

    ElementNode(node) {
      if (tags.has(node.tag)) {
        // check if class attribute already exists
        const classAttr = node.attributes.find((attr) => attr.name === 'class');
        if (classAttr) {
          classAttr.value.chars += ' ' + postfix;
        } else {
          // push class attribute
          node.attributes.push(
            recast.builders.attr('class', recast.builders.text(postfix))
          );
        }
      }
    },
  });

  let result = recast.print(ast);
  return result;
};
