import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'ember-qunit';

module('[In App] show-time', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<ShowTime />`);

    assert.dom('h2').hasClass('e6e05c2f6');
    assert.dom('h2').hasStyle({ color: 'rgb(0, 0, 255)' });
  });
});
