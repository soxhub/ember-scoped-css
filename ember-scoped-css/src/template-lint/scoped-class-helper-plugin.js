import { Rule } from 'ember-template-lint';

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
              'You cannot pass dynamic values to scoped-class helper. {{scoped-class "some-class"}}',
            node,
          });
        }
      } else {
        this.log({
          message:
            'At least one class is required to be passed to scoped-class helper. {{scoped-class "some-class"}}',
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

export default {
  name: 'scoped-class-helper-plugin',
  rules: {
    'scoped-class-helper': ScopedClassHelperRule,
  },
};
