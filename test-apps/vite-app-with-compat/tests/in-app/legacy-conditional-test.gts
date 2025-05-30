import { render, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { tracked } from '@glimmer/tracking';

import Legacy from 'vite-app-with-compat/components/in-app/legacy-conditional';

import { scopedClass } from 'ember-scoped-css/test-support';

function cell<T>(value: T) {
  return new (class {
    @tracked current = value;
  })();
}

module('[In App] legacy-conditional (hbs)', function (hooks) {
  setupRenderingTest(hooks);

  test('has a style on an element', async function (assert) {
    const truthiness = cell(true);
    await render(
      <template><Legacy @isTrue={{truthiness.current}} /></template>
    );

    assert
      .dom('div')
      .hasClass(
        scopedClass(
          'is-true',
          'vite-app-with-compat/components/in-app/legacy-conditional'
        )
      );
    assert.dom('div').hasStyle({ color: 'rgb(0, 100, 200)' });

    truthiness.current = false;
    await settled();

    assert
      .dom('div')
      .hasClass(
        scopedClass(
          'is-false',
          'vite-app-with-compat/components/in-app/legacy-conditional'
        )
      );
    assert.dom('div').hasStyle({ color: 'rgb(200, 100, 0)' });
  });
});
