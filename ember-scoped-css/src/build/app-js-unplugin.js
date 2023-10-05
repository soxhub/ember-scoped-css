import path from 'node:path';

import { createUnplugin } from 'unplugin';

import generateHash from '../lib/generateAbsolutePathHash.js';
import getClassesTagsFromCss from '../lib/getClassesTagsFromCss.js';
import replaceGlimmerAst from '../lib/replaceGlimmerAst.js';

function* iterateOpcodes(opcodes) {
  for (let instruction of opcodes) {
    if (!Array.isArray(instruction)) {
      continue;
    }

    yield instruction;

    for (let subInstruction of iterateOpcodes(instruction)) {
      yield subInstruction;
    }
  }
}

function inflateTagName(tag) {
  if (typeof tag === 'string') {
    return tag;
  } else {
    if (tag === 0) {
      return 'div';
    } else if (tag === 1) {
      return 'span';
    } else if (tag === 2) {
      return 'p';
    } else if (tag === 3) {
      return 'a';
    }
  }

  throw new Error('Unknown tag');
}

export default createUnplugin(({ appDir }) => {
  return {
    name: 'app-js-unplugin',

    transformInclude(id) {
      return (
        id.includes(path.basename(appDir)) &&
        (id.endsWith('.js') || id.endsWith('.hbs'))
      );
    },

    /**
     * This whole thing is error prone, and we should switch the embroider
     * technique to using a babel plugin.
     *
     * Using a webpack plugin is too late in the process.
     * We don't want to be dealing with wire-format, because
     * - it's not public API
     * - it can change as ember-source is upgraded
     * - the numbers are not "stable", in that they are bitwise anded and ored
     *   together so that storage is efficient -- which means we'd need to know
     *   all the opcodes and appropriately | / & to deconstruct appropriately.
     * @returns
     */
    async transform(code, id) {
      const cssPath = id.replace(/(\.js)|(\.hbs)/, '.css');
      let moduleGroupPath = cssPath;

      // Pods support
      if (id.endsWith('template.hbs')) {
        moduleGroupPath = path.dirname(cssPath);
      }

      const postfix = generateHash(moduleGroupPath);

      return await replaceGlimmerAst(code, id, (opcodes, css) => {
        const { classes, tags } = getClassesTagsFromCss(css);
        // this.addWatchFile(cssPath);
        const insertions = [];

        for (let instruction of iterateOpcodes(opcodes[0])) {
          // replace classes
          if (
            instruction[0] === 14 &&
            instruction[1] === 0 &&
            instruction[2] &&
            instruction[2].split(' ').find((i) => classes.has(i.trim()))
          ) {
            // 14 - css attribute, 0 - class
            instruction[2] = instruction[2]
              .split(' ')
              .map((className) => {
                if (className.trim() && classes.has(className.trim())) {
                  return className.trim() + '_' + postfix;
                } else {
                  return className;
                }
              })
              .join(' ');
          }

          // replace strings in if conditions
          // this is brittle, because subexpressions can be deeply nested
          //
          // this particular one is <div class="global-probably {{if @condition "a-local-class"}}">"
          // if (instruction[0] === 15 && Array.isArray(instruction[1]) && instruction[1][0] === 29) {

          // }

          // add postfix to tags
          if (
            instruction[0] === 10 &&
            tags.has(inflateTagName(instruction[1]))
          ) {
            // 10 - open element
            let existingClassInstruction;

            for (
              let i = opcodes[0].indexOf(instruction);
              i <= opcodes[0].length;
              i++
            ) {
              if (opcodes[0][i][0] === 14 && opcodes[0][i][1] === 0) {
                // 14 - css attribute, 0 - class
                existingClassInstruction = opcodes[0][i];

                break;
              }

              if (opcodes[0][i][0] === 12) {
                // 12 - flush element
                break;
              }
            }

            if (existingClassInstruction) {
              existingClassInstruction[2] += ' ' + postfix;
            } else {
              const classInstruction = [14, 0, postfix, undefined];

              insertions.push([instruction, classInstruction]);
            }
          }
        }

        // insert new instructions
        for (let [instruction, classInstruction] of insertions) {
          const index = opcodes[0].indexOf(instruction);

          opcodes[0].splice(index + 1, 0, classInstruction);
        }

        // rewrite opcodes
        // const dbg = new WireFormatDebugger(opcodes);
        // const wfd = dbg.format(opcodes);

        return opcodes;
      });
    },
  };
});
