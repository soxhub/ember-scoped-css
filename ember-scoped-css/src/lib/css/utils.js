import { existsSync, readFileSync } from 'fs';

import getClassesTagsFromCss from '../getClassesTagsFromCss';

/**
 * @param {string} cssPath path to a CSS file
 */
export function getCSSInfo(cssPath) {
  if (!existsSync(cssPath)) {
    return null;
  }

  let css = readFileSync(cssPath, 'utf8');
  let result = getClassesTagsFromCss(css);

  return result;
}
