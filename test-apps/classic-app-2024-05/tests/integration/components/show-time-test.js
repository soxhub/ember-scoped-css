import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'classic-app-2024-05/tests/helpers';

module('Integration | Component | show-time', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<ShowTime />`);

    assert.dom('h2').hasClass('ed9ae5223');
    assert.dom('h2').hasStyle({ color: 'rgb(0, 0, 255)' });
  });
});
