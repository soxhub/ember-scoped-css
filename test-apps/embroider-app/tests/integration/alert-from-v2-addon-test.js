import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'test-app/tests/helpers';

import { scopedClass } from 'ember-scoped-css/test-support';

module('Integration | Component | Alert from v2-addon', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<Alert />`);

    assert.dom('p').hasClass('message_e4b9579df');
    assert.dom('p').hasStyle({ fontStyle: 'italic' });
    assert
      .dom('p')
      .hasClass(scopedClass('message', 'v2-addon/components/alert'));
  });
});
