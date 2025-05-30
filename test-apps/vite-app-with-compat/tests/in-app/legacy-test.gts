import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import Legacy from 'vite-app-with-compat/components/in-app/legacy';

import { scopedClass } from 'ember-scoped-css/test-support';

module('[In App] legacy (hbs)', function (hooks) {
  setupRenderingTest(hooks);

  test('has a style on an element', async function (assert) {
    await render(<template><Legacy /></template>);

    assert
      .dom('div')
      .hasClass(
        scopedClass('legacy', 'vite-app-with-compat/components/in-app/legacy')
      );
    assert.dom('div').hasStyle({ color: 'rgb(0, 100, 200)' });
    assert.dom('p').hasStyle({ color: 'rgb(0, 100, 201)' });
    assert.dom('span').hasStyle({ color: 'rgb(0, 100, 202)' });
  });
});
