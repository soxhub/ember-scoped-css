import { expect } from 'chai';
import { stub } from 'sinon';
import rewriteCss from '../src/rewriteCss.js';

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

  it.only('sudnt rewrite keyframes', function () {
    const css = `
      @keyframes luna-view-navigation {
        100% {
          padding-top: 1rem;
        }
      }
    `;

    const postfix = 'postfix';
    const fileName = 'foo.css';
    const rewritten = rewriteCss(css, postfix, fileName);

    expect(rewritten).to.equal(
      `/* foo.css */\n@layer components {\n\n${css}\n}\n`
    );
  });
});
