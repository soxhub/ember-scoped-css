import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'classic-app/tests/helpers';
import { Strict } from 'v2-addon-ts/components/strict';

import { scopedClass } from 'ember-scoped-css/test-support';

module('[v2 Addon TS] Integration | Component | Strict import', function (hooks) {
  setupRenderingTest(hooks);

  test('strict mode', async function (assert) {
    await render(<template>
      <Strict />
    </template>
    );

    assert
      .dom('p')
      .hasClass(
        scopedClass('hi', 'v2-addon-ts/components/strict')
      );
    assert.dom('p').hasStyle({ color: 'rgb(0, 0, 255)' });
  });
});
