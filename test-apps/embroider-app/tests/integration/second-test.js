import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'test-app/tests/helpers';

import { scopedClass } from 'ember-scoped-css/test-support';

module('Integration | Component | second', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<Second />`);

    assert.dom('h3').hasClass('header_e7d184117');
    assert.dom('h3').hasClass('pb-4');
    assert
      .dom('h3')
      .hasClass(/pb-4/, 'classes not from the stylesheet are untouched');
    assert.dom('h3').hasStyle({ margin: '0px -15px' });
    assert
      .dom('h3')
      .hasClass(scopedClass('header', 'test-app/components/second'));
  });
});
