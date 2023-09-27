import babelParser from '@babel/parser';
import recast from 'recast';

const parseOptions = {
  parser: babelParser,
};

export default function (script, replaceFunction) {
  const ast = recast.parse(script, parseOptions);

  recast.visit(ast, {
    visitCallExpression(path) {
      const node = path.node;

      if (
        node.callee.name === '__GLIMMER_TEMPLATE' ||
        node.callee.name === 'precompileTemplate'
      ) {
        if (node.arguments[0].type === 'TemplateLiteral') {
          node.arguments[0].quasis[0].value.raw = replaceFunction(
            node.arguments[0].quasis[0].value.raw,
          );
        } else if (
          node.arguments[0].type === 'StringLiteral' ||
          node.arguments[0].type === 'Literal'
        ) {
          node.arguments[0].value = replaceFunction(node.arguments[0].value);
        }
      }

      this.traverse(path);
    },
  });

  return recast.print(ast).code;
}
