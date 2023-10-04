import { render, visit } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupApplicationTest } from 'pods-embroider-app/tests/helpers';

import { scopedClass } from 'ember-scoped-css/test-support';

module('Application | visit `/`', function (hooks) {
  setupApplicationTest(hooks);

  test('it has scoped class', async function (assert) {
    await visit('/');

    assert
      .dom('h3')
      .hasClass(
        scopedClass('', 'pods-embroider-app/routes/application'),
      );
    assert.dom('h3').hasStyle({ color: 'rgb(0, 255, 0)' });
  });
});
