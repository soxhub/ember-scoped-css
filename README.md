# ember-scoped-css

`ember-scoped-css` is a modern addon that allows you to isolate your CSS in a modular way with co-located scoped CSS. This is a build-time-only addon and therefore is fully supported if your app is built with Embroider.

With `ember-scoped-css` you can write your component styles in a co-located `.css` file next to your `.hbs` or `.gjs/.gts` files. Every selector you write in your styles is automatically scoped to the component. So you can develop your component with styles isolated from the rest of the application and you don't have to worry about CSS selectors collisions or issues with the CSS cascade.

If you want to read more specifics on how this addon achieves isolation with CSS you can read more in the [detailed CSS isolation documentation](docs/css-isolation.md)

As selectors are scoped/renamed during the build process. So there is no performance hit when running the app.

## Compatibility

- V2 addons

We only support using `ember-scoped-css` as a rollup plugin with a V2 addon right now but we are actively working to support embroider apps and classic ember apps.

## Installation for a V2 Addon

```
npm install --save-dev ember-scoped-css
```

1. If you want to use `.gjs/gts` components, then follow the instructions from [rollup-plugin-glimmer-template-tag](https://github.com/NullVoxPopuli/rollup-plugin-glimmer-template-tag) addon.

2. Add the following to your `rollup.config.mjs`:

```diff
+ import { scoped-css-unplugin } from 'ember-scoped-css';

// if you want to have some global styles in your addon then
// put them in the styles folder and change the path to the styles folder
// if there are no global styles then you can remove addon.keepAssets
- addon.keepAssets(['**/*.css']),
+ addon.keepAssets(['**/styles/*.css']),

// add the following to the rollup config
+ scopedCssUnplugin.rollup(),
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

With `ember-scoped-css` you define styles in `.css` files that are colocated with your components

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

### Passing classes as arguments to a component

There is a `scoped-class` helper that you can use to pass a class name as an argument to a component. The helper takes a class name and returns a scoped class name. `scoped-class` helper is replaced at build time so there is no performance hit when running the app.

```hbs
{{! src/components/my-component.hbs }}
<OtherComponent @internalClass={{scoped-class 'hello-class'}} />
<OtherComponent @internalClass={{(scoped-class 'hello-class')}} />
<OtherComponent
  @internalClass={{concat (scoped-class 'hello-class') ' other-class'}}
/>
```

## Testing

As classes are renamed during the build process you can't directly verify if classes are present in your tests. To solve this problem you can use the `scopedClass` function from the `ember-scoped-css/test-support` module. The function takes the class names and path to the CSS file where are the classes defined and returns the scoped class names.

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
## Linting

`ember-scoped-css` exports a ember-template-lint plugin with one rule `scoped-class-helper`. This lint rule is intended to help you prevent improper use of the `scoped-class` helper which might not be immediately obvious during regular development. You can read more information in the [lint rules documentation](docs/lint-rules.md)

### Steps for adding the rule to the project

1. Add `ember-scoped-css` plugin to `.template-lintrc.js`

```diff
'use strict';

module.exports = {
	plugins: [
+    'ember-scoped-css/src/template-lint/plugin'
  ],

```

2. Add `scoped-class-helper` rule to `.template-lintrc.js`

```diff
'use strict';

module.exports = {
	plugins: [
    'ember-scoped-css/src/template-lint/plugin'
  ],
  rules: {
+    'scoped-class-helper': 'error',
  }

```

## License

This project is licensed under the [MIT License](LICENSE.md).
