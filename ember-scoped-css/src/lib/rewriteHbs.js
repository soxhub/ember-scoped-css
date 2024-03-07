import recast from 'ember-template-recast';

import renameClass from './renameClass.js';

export default function rewriteHbs(hbs, classes, tags, postfix, scopedClass = 'scoped-class') {
  let ast = recast.parse(hbs);
  let stack = [];

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
            } else if (part.type === 'MustacheStatement') {
              recast.traverse(part, {
                StringLiteral(node) {
                  const renamedClass = renameClass(
                    node.value,
                    postfix,
                    classes,
                  );

                  node.value = renamedClass;
                },
              });
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
            recast.builders.attr('class', recast.builders.text(postfix)),
          );
        }
      }
    },

    All: {
      enter(node) {
        stack.push(node);
      },
      exit() {
        stack.pop();
      },
    },

    MustacheStatement(node) {
      let cssClass;

      if (
        node.path?.original === scopedClass &&
        node.params?.length === 1 &&
        node.params[0].type === 'StringLiteral'
      ) {
        cssClass = node.params[0].value;
      }

      if (
        node.path?.path?.original === scopedClass &&
        node.path?.params?.length === 1 &&
        node.path?.params[0].type === 'StringLiteral'
      ) {
        cssClass = node.path.params[0].value;
      }

      if (cssClass) {
        const textNode = recast.builders.text(renameClass(cssClass, postfix));
        const parent = stack[stack.length - 1];

        if (parent.type === 'AttrNode') {
          parent.quoteType = '"';
        }

        return textNode;
      }
    },

    SubExpression(node) {
      if (
        node.path?.original === scopedClass &&
        node.params?.length === 1 &&
        node.params[0].type === 'StringLiteral'
      ) {
        const cssClass = node.params[0].value;
        const textNode = recast.builders.literal(
          'StringLiteral',
          renameClass(cssClass, postfix),
        );

        return textNode;
      }
    },
  });

  let result = recast.print(ast);

  return result;
}
