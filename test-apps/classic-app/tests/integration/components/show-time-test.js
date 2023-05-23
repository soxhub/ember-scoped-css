import { module, test } from 'qunit';
import { setupRenderingTest } from 'classic-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | show-time', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<ShowTime />`);

    const elem = this.element.querySelector('h2');
    assert.ok(elem.classList.contains('ed98ac90a'));

    const style = window.getComputedStyle(elem);
    assert.strictEqual(style.color, 'rgb(0, 0, 255)');
  });
});
