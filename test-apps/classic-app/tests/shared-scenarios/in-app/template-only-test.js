import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { scopedClass } from 'ember-scoped-css/test-support';

module('[In App] template-only', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<TemplateOnly />`);

    assert
      .dom('div')
      .hasClass(
        scopedClass('some-class', 'classic-app/components/template-only'),
      );
    assert.dom('div').hasStyle({ color: 'rgb(0, 0, 255)' });
  });
});
