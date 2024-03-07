import babelParser from '@babel/parser';
import recast from 'recast';

const parseOptions = {
  parser: {
    parse(source) {
      return babelParser.parse(source, {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        tokens: true,
      });
    },
  },
};

export default function (script, replaceFunction) {
  const ast = recast.parse(script, parseOptions);
  let importedScopedClass;

  recast.visit(ast, {
    visitImportDeclaration(path) {
      if (path.node.source.value === 'ember-scoped-css') {
        let specifier = path.node.specifiers.find(
          (x) => x.imported.name === 'scopedClass',
        );

        if (specifier) {
          importedScopedClass = specifier.local.name;
        }

        path.prune();

        return false;
      }

      this.traverse(path);
    },
    visitCallExpression(path) {
      const node = path.node;

      const scopedClass = importedScopedClass ?? 'scoped-class';

      /**
       * __GLIMMER_TEMPLATE is for use with
       * https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag/
       * which uses
       * https://github.com/ember-template-imports/ember-template-imports/
       * @v3, which is known to have a lot of parser bugs.
       *
       * in @embroider/addon-dev@v4, we have native GJS support
       * and we don't inline co-located hbs and JS (or rather, a rollup optimization later does it for us).
       * Instead, we import, which looks like this:
       * ```
       * import TEMPLATE from './the-file.hbs';
       *
       * ...
       *
       * setComponentTemplate(TEMPLATE, X);
       * ```
       * And we don't want to enter this codepath (or rather, it no-ops).
       * _BUT_, because this file imports the hbs file, we'll end up here later
       * and ready to hit the `precompileTemplate` codepath.
       */
      if (
        node.callee.name === '__GLIMMER_TEMPLATE' ||
        node.callee.name === 'precompileTemplate'
      ) {
        if (node.arguments[0].type === 'TemplateLiteral') {
          node.arguments[0].quasis[0].value.raw = replaceFunction(
            node.arguments[0].quasis[0].value.raw,
            scopedClass,
          );
        } else if (
          node.arguments[0].type === 'StringLiteral' ||
          node.arguments[0].type === 'Literal'
        ) {
          node.arguments[0].value = replaceFunction(
            node.arguments[0].value,
            scopedClass,
          );
        }
      }

      this.traverse(path);
    },
  });

  return recast.print(ast).code;
}
