import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import babelParser from '@babel/parser';
import recast from 'recast';

const parseOptions = {
  parser: babelParser,
};

export default async function replaceGlimmerAst(script, id, replaceFunction) {
  const ast = recast.parse(script, parseOptions);
  const cssPath = id.replace(/(\.js)|(\.hbs)/, '.css');
  let css;

  const cssExists = existsSync(cssPath);

  if (cssExists) {
    css = await readFile(cssPath, 'utf-8');
  }

  if (!css) {
    return script;
  }

  recast.visit(ast, {
    visitCallExpression(nodePath) {
      const node = nodePath.node;

      if (
        node.callee.name === 'createTemplateFactory' &&
        node.arguments.length === 1
      ) {
        const blockProp = node.arguments[0].properties.find(
          (prop) => prop.key.value === 'block',
        );
        const opcodes = JSON.parse(blockProp.value.value);
        const newOpcodes = replaceFunction(opcodes, css);

        blockProp.value.value = JSON.stringify(newOpcodes);

        const fileName = path.basename(cssPath);
        // if (!importPath) {
        //   unplugin.addWatchFile(cssPath);
        // }
        const importCss = recast.parse(
          `import './${fileName}';\n`,
          parseOptions,
        );
        const importCssNode = importCss.program.body[0];

        ast.program.body.unshift(importCssNode);
      }

      this.traverse(nodePath);
    },
  });

  const resultScript = recast.print(ast).code;

  return resultScript;
}
