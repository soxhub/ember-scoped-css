const template = require('@babel/template').default;
const replaceScopedClass = require('./replaceScopedClass');
const nodePath = require('path');
const renameClass = require('./renameClass');
const getPostfix = require('./getPostfix');

const scopedClass = (babel) => {
  let scopedClassName = '';
  return {
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === 'ember-scoped-css') {
          // find import scopedClass
          let sc = path.node.specifiers.find(
            (s) => s.imported.name === 'scopedClass'
          );

          // store scopedClass local name
          scopedClassName = sc.local.name;

          // remove import scopedClass
          if (path.node.specifiers.length === 1) {
            path.remove();
          } else {
            path.node.specifiers = path.node.specifiers.filter((s) => s !== sc);
          }
        }
      },

      CallExpression(path, state) {
        if (path.node?.callee?.name === 'precompileTemplate') {
          let source = '';
          if (path.node.arguments[0].type === 'StringLiteral') {
            source = path.node.arguments[0].value;
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

        // scopedClass helper
        if (
          scopedClassName &&
          path.node?.callee?.name === scopedClassName &&
          path.node.arguments.length === 2 &&
          path.node.arguments[0].type === 'StringLiteral' &&
          path.node.arguments[1].type === 'StringLiteral'
        ) {
          // get class name and css file path from scopedClass helper
          let [className, relativeCssFilePath] = path.node.arguments.map(
            (a) => a.value
          );

          // rename class
          let cssFilePath = nodePath.resolve(
            nodePath.dirname(state.filename),
            relativeCssFilePath
          );
          let postfix = getPostfix(cssFilePath);
          let renamedClass = renameClass(className, postfix);

          // replace scopedClass helper with renamed class
          path.replaceWith(babel.types.stringLiteral(renamedClass));
        }
      },
    },
  };
};

module.exports = scopedClass;
