import generateHash from './lib/generateHash.js';
import renameClass from './lib/renameClass.js';

export function scopedClass(className, relativeCssPath) {
  return renameClass(className, generateHash(relativeCssPath));
}
