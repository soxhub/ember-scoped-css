import { module, test } from 'qunit';
import { setupRenderingTest } from 'classic-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | scoped', function (hooks) {
  setupRenderingTest(hooks);

  test('it replaces the scoped-class helper', async function (assert) {
    await render(hbs`<Scoped />`);
    const elem = this.element.querySelector('div');
    assert.deepEqual(
      elem.getAttribute('data-scoped-class'),
      'some-class_e70cde134'
    );
    assert.deepEqual(
      elem.getAttribute('data-scoped-class-2'),
      'some-class-2_e70cde134'
    );
  });
});
