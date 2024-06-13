import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'ember-qunit';
import { StrictClass } from 'v2-addon-ts/components/strict-class';

import { scopedClass } from 'ember-scoped-css/test-support';

module('[v2 Addon TS] Integration | Component | Strict class import', function (hooks) {
  setupRenderingTest(hooks);

  test('strict mode', async function (assert) {
    await render(<template>
      <StrictClass />
    </template>
    );

    assert
      .dom('div')
      .hasClass(
        scopedClass('hello-there', 'v2-addon-ts/components/strict-class')
      );
    assert.dom('div').hasStyle({ color: 'rgb(1, 2, 3)' });
  });
});
