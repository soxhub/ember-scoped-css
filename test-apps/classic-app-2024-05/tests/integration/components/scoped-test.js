import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'classic-app-2024-05/tests/helpers';

module('Integration | Component | scoped', function (hooks) {
  setupRenderingTest(hooks);

  test('it replaces the scoped-class helper', async function (assert) {
    await render(hbs`<Scoped />`);

    assert.dom('div').hasAttribute('data-scoped-class', 'some-class_e80b6d598');
    assert
      .dom('div')
      .hasAttribute('data-scoped-class-2', 'some-class-2_e80b6d598');
  });
});
