const expect = require('chai').expect;
const { stub } = require('sinon');
const rewriteCss = require('../src/rewriteCss');

describe('rewriteCss', function () {
  it('should rewrite css', function () {
    const css = '.foo { color: red; }';
    const postfix = 'postfix';
    const fileName = 'foo.css';
    const rewritten = rewriteCss(css, postfix, fileName);

    expect(rewritten).to.equal(
      `/* foo.css */\n@layer components {\n\n.foo_postfix { color: red; }\n}\n`
    );
  });

  it('shouldnt rewrite global', function () {
    const css = '.baz :global(.foo p) .bar { color: red; }';
    const postfix = 'postfix';
    const fileName = 'foo.css';
    const rewritten = rewriteCss(css, postfix, fileName);

    expect(rewritten).to.equal(
      `/* foo.css */\n@layer components {\n\n.baz_postfix .foo p .bar_postfix { color: red; }\n}\n`
    );
  });
});
