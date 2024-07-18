import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'test-app/tests/helpers';

import { scopedClass } from 'ember-scoped-css/test-support';

module('Integration | Component | my-component', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<MyComponent />`);

    assert.dom('h3').hasClass('header_e2b2be1e7');
    assert.dom('h3').hasStyle({ color: 'rgb(255, 0, 0)' });
    assert
      .dom('h3')
      .hasClass(scopedClass('header', 'test-app/components/my-component'));
  });
});
