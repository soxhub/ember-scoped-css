import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'classic-app/tests/helpers';

module('Integration | Component | header', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<Header />`);

    const elem = this.element.querySelector('h1');

    assert.ok(elem.classList.contains('test-header_ee0100766'));

    const style = window.getComputedStyle(elem);

    assert.strictEqual(style.color, 'rgb(255, 0, 0)');
  });
});
