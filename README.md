## ember-scoped-css

When you build a component, you create `.js/.ts` file and `.hbs` file or `.gjs/.gts` file. You are developing a component isolated from the rest of the application.
Styles in ember are global to the whole application and it's only on the developer to make sure that styles for one component don't affect styles for another component. That can be a challenge in a bigger project.

`ember-scoped-css` solves this problem by scoping styles to the component.
With `ember-scoped-css` you can write your component styles in a co-located `.css` file or embedded in the `<style>` tag inside `.gjs/.gts` file. Every selector you write in your styles is automatically scoped to the component. So you can develop your component with styles isolated from the rest of the application and you don't have to worry about CSS selectors collisions.

Selectors are scoped/renamed during the build process. So there is no performance hit when running the app.

## Compatibility

- V2 addons

## Installation

```
ember install ember-scoped-css
```

1. If you want to use `.gjs/gts` components, then follow the instructions from [rollup-plugin-glimmer-template-tag](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag) addon.

2. Add the following to your `rollup.config.mjs`:

```diff
+ import { addonCssRollup, addonHbsRollup, addonJsUnplugin, addonRewritecssRollup } from 'ember-scoped-css';

// if you want to have some global styles in your addon then
// put them in the styles folder and change the path to the styles folder
// if there are no global styles then you can remove addon.keepAssets
- addon.keepAssets(['**/*.css']),
+addon.keepAssets(['**/styles/*.css']),

// add the following to the rollup config
+ addonRewritecssRollup(),
+ addonCssRollup(),
+ addonJsUnplugin.rollup(),
+ addonHbsRollup(),
```

3. Add `babel-plugin-scoped-class` as the last plugin to your `babel.config`:

```diff
{
  "plugins": [
    [
      ...existing plugins,
+     'ember-scoped-css/babel-plugin-scoped-class',
    ]
  ]
}
```

## Usage

With `ember-scoped-css` you define styles colocated with the component or embedded in the `<style>` tag inside `.gjs/.gts`.

### Colocated styles

```hbs
{{! src/components/my-component.hbs }}
<div data-test-my-component class='hello-class header'><b>Hello</b>, world!</div>
```

```css
/* src/components/my-component.css */
.hello-class {
  color: red;
}

/* the :global() pseudo-class is used to define a global class. It mean that header class wont be scoped to that component */
.hello-class:global(.header) {
  font-size: 20px;
}

b {
  color: blue;
}
```

### Embedded styles

```js
{{! src/components/my-component.gjs }}
<style>
  .hello-class {
    color: red;
  }
  /* the :global() pseudo-class is used to define a global class. It mean that header class wont be scoped to that component */
  .hello-class:global(.header) {
    font-size: 20px;
  }
  b {
    color: blue;
  }
</style>
<template>
  <div data-test-my-component class='hello-class header'><b>Hello</b>, world!</div>
</template>
```

```js
// src/components/my-component.gjs
import Component from '@glimmer/component';

<style>
  .hello-class {
    color: red;
  }
  /* the :global() pseudo-class is used to define a global class. It mean that header class wont be scoped to that component */
  .hello-class:global(.header) {
    font-size: 20px;
  }
  b {
    color: blue;
  }
</style>

export default MyComponent extends Component{
  <template>
    <div data-test-my-component class='hello-class header'><b>Hello</b>, world!</div>
  </template>
}
```

### Class as an argument to a component

There is a `scoped-class` helper that you can use to pass a class name as an argument to a component. The helper takes a class name and returns a scoped class name. `scoped-class` helper is replaced at build time so there is no performance hit when running the app.

```hbs
{{! src/components/my-component.hbs }}
<OtherComponent @internalClass={{scoped-class 'hello-class'}} />
<OtherComponent @internalClass={{(scoped-class 'hello-class')}} />
<OtherComponent
  @internalClass={{concat (scoped-class 'hello-class ') 'other-class'}}
/>
```

## Testing

Classes are renamed during the build process. So you can't use the same class names in your tests as you use in your components. To solve this problem you can use `scopedClass` function from `ember-scoped-css/test-support` module. The function takes the class names and path to the CSS file where are the classes defined and returns the scoped class names.
The path to the CSS file is always relative to the V2 addon root no matter where the test is located.

```js
import { scopedClass } from 'ember-scoped-css/test-support';

test('MyComponent has hello-class', async function (assert) {
  assert.expect(1);

  await render(hbs`
    <MyComponent />
  `);

  const rewrittenClass = scopedClass(
    'hello-class',
    'src/components/my-component.css'
  );

  assert.dom('[data-test-my-component]').hasClass(rewrittenClass);
});
```

## License

This project is licensed under the [MIT License](LICENSE.md).

## Setup ember-template-lint

`ember-scoped-css` exports one ember-template-lint plugin `scoped-class-helper-plugin` with one rule `scoped-class-helper`.

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
+    'scoped-class-helper': 'error',
  }

```
