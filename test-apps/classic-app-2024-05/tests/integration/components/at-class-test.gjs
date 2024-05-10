import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import ComponentAtClass from 'classic-app-2024-05/components/component-at-class';
import { setupRenderingTest } from 'classic-app-2024-05/tests/helpers';

import { scopedClass } from 'ember-scoped-css/test-support';


module('Integration | Component | @class', function (hooks) {
  setupRenderingTest(hooks);

  test('strict mode', async function (assert) {
    await render(<template>
      <ComponentAtClass />
    </template>
    );

    assert
      .dom('p')
      .hasClass(
        scopedClass('text-color', 'classic-app-2024-05/components/component-at-class')
      );
    assert.dom('p').hasStyle({ color: 'rgb(0, 0, 255)' });
  });

  test('loose mode', async function (assert) {
    await render(hbs`
      <ComponentAtClass />
    `);

    assert
      .dom('p')
      .hasClass(
        scopedClass('text-color', 'classic-app-2024-05/components/component-at-class')
      );
    assert.dom('p').hasStyle({ color: 'rgb(0, 0, 255)' });
  });
});
