import { expect } from 'chai';

import generateHash from '../src/lib/generateAbsolutePathHash.js';

describe('generateHash', function () {
  it('should return a string', function () {
    const postfix = generateHash('foo.css');

    expect(postfix).to.be.a('string');
  });

  it('should return a string starting with "e"', function () {
    const postfix = generateHash('foo.css');

    expect(postfix).to.match(/^e/);
  });

  it('should return a string of length 9', function () {
    const postfix = generateHash('foo.css');

    expect(postfix).to.have.lengthOf(9);
  });
});
