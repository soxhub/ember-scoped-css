import { expect } from 'chai';

import rewriteCss from '../src/lib/rewriteCss.js';

describe('rewriteCss', function () {
  it('should rewrite css', function () {
    const css = '.foo { color: red; }';
    const postfix = 'postfix';
    const fileName = 'foo.css';
    const rewritten = rewriteCss(css, postfix, fileName, false);

    expect(rewritten).to.equal(`/* foo.css */\n.foo_postfix { color: red; }\n`);
  });

  it('should use a custom layer', function () {
    const css = '.foo { color: red; }';
    const postfix = 'postfix';
    const fileName = 'foo.css';
    const rewritten = rewriteCss(css, postfix, fileName, 'utils');

    expect(rewritten).to.equal(
      `/* foo.css */\n@layer utils {\n\n.foo_postfix { color: red; }\n}\n`
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

  it(`shouldn't rewrite keyframes`, function () {
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
