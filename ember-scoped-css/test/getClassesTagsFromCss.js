import { expect } from 'chai';
import getClassesTagsFromCss from '../src/lib/getClassesTagsFromCss.js';

describe('rewriteCss', function () {
  it('should return classes and tags that are not in :global', function () {
    const css = '.baz :global(.foo) .bar div :global(p)  { color: red; }';
    const { classes, tags } = getClassesTagsFromCss(css);

    // classes should be baz and bar
    expect(classes.size).to.equal(2);
    expect([...classes]).to.have.members(['baz', 'bar']);
    expect(tags.size).to.equal(1);
    expect([...tags]).to.have.members(['div']);
  });
});
