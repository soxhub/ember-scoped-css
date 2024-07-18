import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

module('[In App] scoped', function (hooks) {
  setupRenderingTest(hooks);

  test('it replaces the scoped-class helper', async function (assert) {
    await render(hbs`<Scoped />`);

    assert.dom('div').hasAttribute('data-scoped-class', 'some-class_e4aeedfc0');
    assert
      .dom('div')
      .hasAttribute('data-scoped-class-2', 'some-class-2_e4aeedfc0');
  });
});
