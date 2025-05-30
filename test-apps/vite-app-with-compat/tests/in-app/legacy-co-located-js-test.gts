import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import Legacy from 'vite-app-with-compat/components/in-app/legacy-co-located-js';

import { scopedClass } from 'ember-scoped-css/test-support';

module('[In App] legacy-co-located-js', function (hooks) {
  setupRenderingTest(hooks);

  test('has a style on an element', async function (assert) {
    await render(<template><Legacy /></template>);

    assert
      .dom('div')
      .hasClass(
        scopedClass(
          'legacy-co-located',
          'vite-app-with-compat/components/in-app/legacy-co-located-js'
        )
      );
    assert.dom('div').hasStyle({ color: 'rgb(0, 100, 200)' });
    assert.dom('p').hasStyle({ color: 'rgb(0, 100, 201)' });
    assert.dom('span').hasStyle({ color: 'rgb(0, 100, 202)' });
  });
});
