import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { scopedClass } from 'ember-scoped-css/test-support';

import { setupRenderingTest } from 'embroider-app/tests/helpers';

module('Integration | Component | template-only', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    await render(hbs`<TemplateOnly />`);

    assert
      .dom('div')
      .hasClass(
        scopedClass('some-class', 'embroider-app/components/template-only')
      );
    assert.dom('div').hasStyle({ color: 'rgb(0, 0, 255)' });
  });
});
