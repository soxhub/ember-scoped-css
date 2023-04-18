import generateHash from './generateHash.js';
import renameClass from './renameClass.js';

export function scopedClass(className, relativeCssPath) {
  return renameClass(className, generateHash(relativeCssPath));
}
