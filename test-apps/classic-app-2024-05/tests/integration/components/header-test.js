import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'classic-app-2024-05/tests/helpers';

import { scopedClass } from 'ember-scoped-css/test-support';

module('Integration | Component | header', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<Header />`);

    assert.dom('h1').hasClass('test-header_e784d3467');
    assert.dom('h1').hasStyle({ color: 'rgb(255, 0, 0)' });
    assert
      .dom('h1')
      .hasClass(
        scopedClass('test-header', 'classic-app-2024-05/components/header'),
      );
  });
});
