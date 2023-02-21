const expect = require('chai').expect;
const { stub } = require('sinon');
const getPostfix = require('../src/getPostfix');

describe('getPostfix', function () {
  it('should return a string', function () {
    const postfix = getPostfix('foo.css');

    expect(postfix).to.be.a('string');
  });

  it('should throw error if filename contains /', function () {
    expect(() => getPostfix('/foo.css')).to.throw(Error);
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
