import assert from 'assert';
import { generateRuleTests } from 'ember-template-lint';

import scopedClassHelperPlugin from '../src/template-lint/plugin.js';

generateRuleTests({
  name: 'scoped-class-helper',

  groupMethodBefore: beforeEach,
  groupingMethod: describe,
  testMethod: it,
  plugins: [scopedClassHelperPlugin],
  config: true,
  good: ['{{scoped-class "test"}}', '{{(scoped-class "test")}}'],
  bad: [
    {
      template: '{{scoped-class}}',

      verifyResults(results) {
        assert.equal(results.length, 1);
        assert.equal(
          results[0].message,
          'One positional param is required to be passed to scoped-class helper. {{scoped-class "some-class"}}. More info: https://github.com/soxhub/ember-scoped-css/blob/main/docs/lint-rules.md'
        );
      },
    },
    {
      template: '{{scoped-class this.someClass}}',

      verifyResults(results) {
        assert.equal(results.length, 1);
        assert.equal(
          results[0].message,
          'You cannot pass dynamic values to scoped-class helper. {{scoped-class "some-class"}}. More info: https://github.com/soxhub/ember-scoped-css/blob/main/docs/lint-rules.md'
        );
      },
    },
  ],
});
