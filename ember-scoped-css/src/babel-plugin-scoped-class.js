import replaceScopedClass from './replaceScopedClass.js';

const scopedClass = () => {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node?.callee?.name === 'precompileTemplate') {
          if (path.node.arguments[0].type === 'StringLiteral') {
            path.node.arguments[0].value = replaceScopedClass(
              path.node.arguments[0].value,
              state.filename,
              state.cwd
            );
          } else if (path.node.arguments[0].type === 'TemplateLiteral') {
            path.node.arguments[0].quasis[0].value.raw = replaceScopedClass(
              path.node.arguments[0].quasis[0].value.raw,
              state.filename,
              state.cwd
            );
          }
        }
      },
    },
  };
};

export default scopedClass;
