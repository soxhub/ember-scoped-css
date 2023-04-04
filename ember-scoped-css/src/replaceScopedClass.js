const recast = require('ember-template-recast');
const renameClass = require('./renameClass');

module.exports = function (hbs, templatePath, basePath) {
  let ast = recast.parse(hbs);
  let stack = [];
  const cssPath = templatePath
    .replace(basePath, '')
    .replace(/(\.hbs)?(\.js)?/, '.css');
  const projectCssPath = cssPath.replace(basePath, '');

  recast.traverse(ast, {
    All: {
      enter(node) {
        stack.push(node);
      },
      exit(node) {
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
        const textNode = recast.builders.text(
          renameClass(cssClass, projectCssPath)
        );
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
          renameClass(cssClass, projectCssPath)
        );
        return textNode;
      }
    },
  });

  let result = recast.print(ast);
  return result;
};
