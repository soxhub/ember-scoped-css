import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { setupApplicationTest } from 'pods-embroider-app/tests/helpers';

import { scopedClass } from 'ember-scoped-css/test-support';

module('Application | visit `/user`', function (hooks) {
  setupApplicationTest(hooks);

  test('it has scoped class', async function (assert) {
    await visit('/user');

    assert
      .dom('div')
      .hasClass(scopedClass('user', 'pods-embroider-app/routes/user'));
    assert.dom('div').hasStyle({ color: 'rgb(0, 0, 100)' });
  });
});
