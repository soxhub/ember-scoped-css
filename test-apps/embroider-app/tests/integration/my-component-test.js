import { module, test } from 'qunit';
import { setupRenderingTest } from 'classic-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { scopedClass } from 'ember-scoped-css/test-helper';

module('Integration | Component | my-component', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<Header />`);

    const elem = this.element.querySelector('h1');
    assert
      .dom(elem)
      .hasClass(scopedClass('header', 'app/components/my-component'));

    const style = window.getComputedStyle(elem);
    assert.strictEqual(style.color, 'rgb(255, 0, 0)');
  });
});
