import { tracked } from '@glimmer/tracking';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupRenderingTest } from 'classic-app-2024-05/tests/helpers';

module('Integration | Component | DynamicAttribute', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    class State {
      @tracked ya = true;
    }

    let state = new State();

    this.setProperties({ state });
    await render(hbs`<DynamicAttribute @foo={{this.state.ya}}/>`);

    assert.dom('div').hasClass('is-foo_efdf9ecfb');
    assert.dom('div').hasStyle({ color: 'rgb(0, 0, 255)' });

    state.ya = false;
    await settled();

    assert.dom('div').hasClass('is-not-foo_efdf9ecfb');
    assert.dom('div').hasStyle({ color: 'rgb(255, 0, 0)' });
  });
});
