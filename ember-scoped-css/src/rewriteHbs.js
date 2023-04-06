const recast = require('ember-template-recast');

module.exports = function rewriteHbs(hbs, classes, tags, postfix) {
  let ast = recast.parse(hbs);

  recast.traverse(ast, {
    AttrNode(node) {
      if (node.name === 'class') {
        if (node.value.type === 'TextNode' && node.value.chars) {
          const newClasses = node.value.chars.split(' ').map((c) => {
            if (c.trim() && classes.has(c.trim())) {
              return c.trim() + '_' + postfix;
            } else {
              return c;
            }
          });

          node.value.chars = newClasses.join(' ');
        } else if (node.value.type === 'ConcatStatement') {
          for (let part of node.value.parts) {
            if (part.type === 'TextNode' && part.chars) {
              const newClasses = part.chars.split(' ').map((c) => {
                if (c.trim() && classes.has(c.trim())) {
                  return c.trim() + '_' + postfix;
                } else {
                  return c;
                }
              });
              part.chars = newClasses.join(' ');
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
