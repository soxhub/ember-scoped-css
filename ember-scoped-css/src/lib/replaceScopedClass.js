import recast from 'ember-template-recast';
import renameClass from './renameClass.js';
import generateHash from './generateAbsolutePathHash.js';

export default function (hbs, templatePath) {
  let ast = recast.parse(hbs);
  let stack = [];
  const cssPath = templatePath.replace(/(\.hbs)?\.js$/, '.css');
  const postfix = generateHash(cssPath);

  recast.traverse(ast, {
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
        node.path?.original === 'scoped-class' &&
        node.params?.length === 1 &&
        node.params[0].type === 'StringLiteral'
      ) {
        cssClass = node.params[0].value;
      }

      if (
        node.path?.path?.original === 'scoped-class' &&
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
        node.path?.original === 'scoped-class' &&
        node.params?.length === 1 &&
        node.params[0].type === 'StringLiteral'
      ) {
        const cssClass = node.params[0].value;
        const textNode = recast.builders.literal(
          'StringLiteral',
          renameClass(cssClass, postfix)
        );
        return textNode;
      }
    },
  });

  let result = recast.print(ast);
  return result;
}
