import md5 from 'blueimp-md5';

/**
 *
 * @param {string} relativePath
 * @returns {string}
 */
export function generateRelativePathHash(relativePath) {
  return 'e' + md5(relativePath).substring(0, 8);
}
