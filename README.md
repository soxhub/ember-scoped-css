# v2-addon

[Short description of the addon.]

## Compatibility

- Ember.js v3.28 or above
- Embroider or ember-auto-import v2

## Installation

```
ember install v2-addon
```

## Usage

[Longer description of how to use the addon in apps.]

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).

## Setup ember-template-lint

`ember-scoped-css` exports one ember-template-lint plugin `scoped-clas-helper-plugin` with one rule `scoped-class-helper`.

### Steps for adding the rule to the project

1. Add `scoped-class-helper-plugin` to `.template-lintrc.js`

```diff
'use strict';

module.exports = {
	plugins: [
+    'ember-scoped-css/src/template-lint/scoped-class-helper-plugin'
  ],

```

2. Add `scoped-class-helper` rule to `.template-lintrc.js`

```diff
'use strict';

module.exports = {
	plugins: [
    'ember-scoped-css/src/template-lint/scoped-class-helper-plugin'
  ],
  rules: {
+    'scoped-class-helper': 'error,
  }

```
