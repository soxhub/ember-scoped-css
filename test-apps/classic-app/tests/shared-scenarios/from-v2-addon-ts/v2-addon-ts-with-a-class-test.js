import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { scopedClass } from 'ember-scoped-css/test-support';

module(
  '[v2 Addon TS] Integration | Component | WithAClass from v2-addon-ts',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it has scoped class', async function (assert) {
      await render(hbs`<WithAClass />`);

      assert.dom('div').hasClass('greeting_efc49be66');
      assert.dom('div').hasStyle({ color: 'rgb(0, 0, 255)' });
      assert
        .dom('div')
        .hasClass(
          scopedClass('greeting', 'v2-addon-ts/components/with-a-class'),
        );
    });
  },
);
