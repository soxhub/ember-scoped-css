import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import { scopedClass } from 'ember-scoped-css/test-support';

module('[In App] pod:top-level (hbs)', function (hooks) {
  setupApplicationTest(hooks);

  test('has a style on an element', async function (assert) {
    await visit('/top-level');

    assert
      .dom('span')
      .hasClass(
        scopedClass(
          'pod-template-class',
          'vite-app-with-compat-pods/pods/top-level'
        )
      );
    assert.dom('p').hasStyle({ fontWeight: '100', fontStyle: 'italic' });
  });
});
