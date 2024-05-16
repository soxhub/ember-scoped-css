import md5 from 'blueimp-md5';

/**
 * The intent of this function is to generate the suffix/postfix for the
 * css classes, based on the module-scoped path name.
 *
 * for example,
 *    hash('my-app/components/foo')
 *  instead of
 *    hash('app/components/foo')
 *
 *  (unless your app name is 'app')
 *
 * @param {string} modulePath
 * @returns {string}
 */
export function hash(modulePath) {
  return 'e' + md5(modulePath).substring(0, 8);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('should return a string', function () {
    const postfix = hash('foo.css');

    expect(postfix).to.be.a('string');
  });

  it('should return a string starting with "e"', function () {
    const postfix = hash('foo.css');

    expect(postfix).to.match(/^e/);
  });

  it('should return a string of length 9', function () {
    const postfix = hash('foo.css');

    expect(postfix).to.have.lengthOf(9);
  });
}

export const hashFromModulePath = hash;
