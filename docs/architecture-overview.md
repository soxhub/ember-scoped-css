# Architecture Overview

`ember-scoped-css` is a monorepo with `ember-scoped-css` addon and `test-apps`.

## `ember-scoped-css`

`ember-scoped-css` supports scoping CSS styles in V2 addons and classic ember apps.

### 1. Support for v2 addons

We decided that we will use unplugin plugin for rewriting CSS files and handlebars templates.
Unplugin plugin can be used in the future with different build systems like rollup, vite.
At the same time we wanted simple instalation and this is why we implemented one unplugin plugin
`src/scoped-css-unplugin.js`.

#### Rewriting handlebars templates

In build process of V2 addon babel plugins and rollup plugins transform regullar components, template only components and GJS components to js files.
`src/scoped-css-unplugin.js` finds `precompileTemplate` function with template as it's parameter and rewrites classes in the template.
It also inserts import statement with co-located css file, so the rollup will load that CSS file and it can be also transformed.

#### Rewriting CSS files

`src/scoped-css-unplugin.js` transform css file and emit it as an asset.

When you run build with environemnt variable environment='development' then on `generateBundle` all css assets are concatenated to one file `scoped.css`. If environment is not 'development' then import with css file will be inserted to every component. Then when you start an ember app, webpack will find imported css files and load them with style loaders.

- environment=development will crerate one `scoped.css` file which can be used in an ember js application and live reloading will work
- environment!=development will create css file for every component with imported css file in js file. So the route splitting will work. Live reloading css file dont work in this case.

### 2. Support classic apps

In package json is "ember-addon/main" pointing to `src/ember-addon-main.cjs` where we set css preprocessor for rewriting css files and a babel plugin for rewriting js files.

#### CSS preprocessor - lib/scoped-css-preprocessor.js

There is `setupPreprocessorRegistry` in `ember-addon-main.cjs` where preprocessor is set. We wanted to support ember-css-modules side by side with ember-scoped-css. Therefore we needed to run all preprocessors and then combine the result. So we removed all css preprocessors from the registry and sent them to our preprocessor where we invoke them.
In `scoped-css-preprocessor.js` is exported `ScopedCssPreprocessor` which have `toTree` function where we combine CSS from:

1. `ember-css-module` preprocessor,
2. `ember-scoped-css`
3. `app.css`

#### Babel plugin - src/scoped-babel-plugin.js

We wanted our babel plugin to run after `ember-cli-htmlbars` and `ember-template-imports` plugins, because they transform all type of components (template only, GJS) to javascript file with `precompileTemplate` or `hbs` function. It is specified in `ember-addon/after` property in `package.json`.

### 3. Important functions

#### `rewriteHbs.js`

For rewriting handlebars templates is used `rewriteHbs` function. It is used for V2 addons in `src/scoped-css-unplugin.js` and for classic apps in `src/scoped-babel-plugin.js`.

#### `rewriteCss.js`

For rewriting CSS files is used `rewriteCss` function. It is used for V2 addons in `src/scoped-css-unplugin.js` and for classic apps in `lib/scoped-css-preprocessor.js`.

### Linting

Lint rule is described in `docs/lint-rule.ms`

### Testing

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

## `test-apps`

There are 3 test apps for testing the addon:

1. `classic-app`
   Classic app is tested by integration tests

2. `v2-addon`
   V2 addon is tested by comparing `fixtures/expected-dist` with dist directory.

3. `embroider-app`
