import { module, test } from 'qunit';
import { setupRenderingTest } from 'embroider-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { scopedClass } from 'ember-scoped-css/test-support';

module('Integration | Component | my-component', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<MyComponent />`);
    const elem = this.element.querySelector('h3');
    assert
      .dom('h3')
      .hasClass(
        scopedClass('header', 'embroider-app/components/my-component.css')
      );

    const style = window.getComputedStyle(elem);
    assert.strictEqual(style.color, 'rgb(255, 0, 0)');
  });
});
