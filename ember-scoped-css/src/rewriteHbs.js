const recast = require('ember-template-recast');

module.exports = function rewriteHbs(hbs, classes, tags, postfix) {
  let ast = recast.parse(hbs);

  recast.traverse(ast, {
    AttrNode(node) {
      if (node.name === 'class' && node.value.chars) {
        const newClasses = node.value.chars.split(' ').map((c) => {
          if (c.trim() && classes.has(c.trim())) {
            return c.trim() + '_' + postfix;
          } else {
            return c;
          }
        });

        node.value.chars = newClasses.join(' ');
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
