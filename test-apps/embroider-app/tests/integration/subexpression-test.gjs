import { render, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { cell } from 'ember-resources';
import SubExpression from 'embroider-app/components/subexpression';
import { setupRenderingTest } from 'embroider-app/tests/helpers';

import { scopedClass } from 'ember-scoped-css/test-support';

module('Integration | Component | subexpression', function (hooks) {
  setupRenderingTest(hooks);

  test('it has scoped class', async function (assert) {
    let cond = cell(false);

    await render(<template>
      <SubExpression @condition={{cond.current}} />
    </template>
    );

    assert.dom('div').hasClass('global-probably');

    cond.current = true;
    await settled();


    assert
      .dom('div')
      .hasClass(
        scopedClass('a-local-class', 'embroider-app/components/subexpression')
      );
    assert.dom('div').hasStyle({ color: 'rgb(0, 0, 255)' });
  });
});
