import recast from 'recast';

export default function (script, removeCallExpression = false) {
  const ast = typeof script === 'string' ? recast.parse(script) : script;
  let css = '';

  recast.visit(ast, {
    visitCallExpression(nodePath) {
      const node = nodePath.node;

      if (
        node.callee.name === '__GLIMMER_STYLES' &&
        node.arguments.length === 1
      ) {
        css = node.arguments[0].quasis[0].value.raw;

        if (removeCallExpression) {
          nodePath.prune();

          return false;
        }
      }

      this.traverse(nodePath);
    },
  });

  return { css, ast };
}
