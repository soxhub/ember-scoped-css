import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, skip } from 'qunit';

import { setupRenderingTest } from 'classic-app/tests/helpers';

module('[In App] Misuse', function (hooks) {
  setupRenderingTest(hooks);

  skip('it has scoped class', async function () {
    // Errors (intentional, but we can't catch it)
    // https://github.com/qunitjs/qunit/issues/1736
    await render(hbs`<InApp::Misuse::NoCss />`);
  });
});
