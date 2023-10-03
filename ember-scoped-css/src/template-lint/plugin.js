import { generateRuleTests, Rule } from 'ember-template-lint';

class ScopedClassHelperRule extends Rule {
  visitor() {
    const checkScopedClass = function (node) {
      if (node.path.original !== 'scoped-class') {
        return;
      }

      if (node.params.length === 1) {
        if (node.params[0].type !== 'StringLiteral') {
          this.log({
            message:
              'You cannot pass dynamic values to scoped-class helper. {{scoped-class "some-class"}}. More info: https://github.com/soxhub/ember-scoped-css/blob/main/docs/lint-rules.md',
            node,
          });
        }
      } else {
        this.log({
          message:
            'One positional param is required to be passed to scoped-class helper. {{scoped-class "some-class"}}. More info: https://github.com/soxhub/ember-scoped-css/blob/main/docs/lint-rules.md',
          node,
        });
      }
    };

    return {
      MustacheStatement: checkScopedClass,
      SubExpression: checkScopedClass,
    };
  }
}

const scopedClassHelperPlugin = {
  name: 'scoped-css-plugin',
  rules: {
    'scoped-class-helper': ScopedClassHelperRule,
  },
};

export default scopedClassHelperPlugin;

import assert from 'assert';

if (import.meta.vitest) {
  const { it, describe, beforeEach } = import.meta.vitest;

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
            'One positional param is required to be passed to scoped-class helper. {{scoped-class "some-class"}}. More info: https://github.com/soxhub/ember-scoped-css/blob/main/docs/lint-rules.md',
          );
        },
      },
      {
        template: '{{scoped-class this.someClass}}',

        verifyResults(results) {
          assert.equal(results.length, 1);
          assert.equal(
            results[0].message,
            'You cannot pass dynamic values to scoped-class helper. {{scoped-class "some-class"}}. More info: https://github.com/soxhub/ember-scoped-css/blob/main/docs/lint-rules.md',
          );
        },
      },
    ],
  });
}
