import generateHash from '../lib/generateRelativePathHash.js';
import renameClass from '../lib/renameClass.js';

export function scopedClass(className, relativeCssPath) {
  const hash = generateHash(relativeCssPath);

  console.log({ hash });

  return renameClass(className, hash);
}
