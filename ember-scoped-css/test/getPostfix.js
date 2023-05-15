import { expect } from 'chai';
import getPostfix from '../src/lib/getPostfix.js';

describe('getPostfix', function () {
  it('should return a string', function () {
    const postfix = getPostfix('foo.css');

    expect(postfix).to.be.a('string');
  });

  it('should return a string starting with "e"', function () {
    const postfix = getPostfix('foo.css');

    expect(postfix).to.match(/^e/);
  });

  it('should return a string of length 9', function () {
    const postfix = getPostfix('foo.css');

    expect(postfix).to.have.lengthOf(9);
  });
});
