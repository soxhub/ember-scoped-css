import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import CallsAtHasClass from 'classic-app/components/in-app/at-class-ts/calls-has-at-class';

module('[In App] at-class-ts', function(hooks) {
  setupRenderingTest(hooks);

  test('calls component with @class', async function(assert) {
    await render(
      <template>
        <CallsAtHasClass />
      </template>
    );

    assert.dom('p').hasStyle({ color: '337' });
  });
});
