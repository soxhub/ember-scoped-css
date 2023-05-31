# Architecture Overview

`ember-scoped-css` is a monorepo with the main addon in `ember-scoped-css` and various test apps under the `test-apps` folder.

## `ember-scoped-css`

`ember-scoped-css` currently supports scoping CSS styles in V2 addons and classic ember apps. We don't suspect that there will be much work necessary to support embroider at this point but see [Support for embroider apps](#support-for-embroider-apps) section below for more information.

### Support for v2 addons

`ember-scoped-css` provides an `unplugin` plugin for rewriting CSS files and handlebars templates.This `unplugin` plugin can be used with different build systems like rollup, vite, and webpack. The entire functionality is combined into [a single `unplugin` plugin](/ember-scoped-css/src/scoped-css-unplugin.js) for ease and simplicity of integration.

#### Rewriting handlebars templates

In the build process of V2 addon babel plugins and rollup plugins transform regular components, template only components and GJS components to js files.
`src/scoped-css-unplugin.js` locates `precompileTemplate` function calls with template as the first parameter and rewrites classes in the template.
It also adds a temporary import statement to the JS file that points to the co-located css file, so the rollup process will load that CSS file and it can be  transformed later in the build.

#### Rewriting CSS files

`src/scoped-css-unplugin.js` transforms css files and emits them as an asset.

When you run build with environemnt variable `environment='development'` then on the `generateBundle` step, all css assets are concatenated to one file `scoped.css`. If environment is not `development` then the previously mentioned import statement is left in the component, this allows webpack (or whatever bundler you are using) to find imported css files and load them with style loaders.

- environment=development will crerate one `scoped.css` file which can be used in an ember js application and live reloading will work
- environment!=development will create css file for every component with imported css file in js file. This allows route splitting to work out of the box. Live reloading css file dont work in this case but will likely be possible when embroider progresses further and can use the webpack development server or vite server.

### Support classic apps

In the `package.json` for `ember-scoped-css` the `ember-addon/main` parameter is pointing to `src/ember-addon-main.cjs` where we set css preprocessor for rewriting css files and a babel plugin for rewriting js files.

#### CSS preprocessor - lib/scoped-css-preprocessor.js

There is `setupPreprocessorRegistry` in `ember-addon-main.cjs` where preprocessor is set. We wanted to support a senario where `ember-scoped-css` is used along-side other addons (like ember-css-modules) so we needed to make sure that we ran all registered css preprocessors and then combine the result. 

The ember-cli API for this can be a bit tricky so the solution we came up with was to remove all css preprocessors from the registry and sent them to our preprocessor where we invoke them after our own CSS preprocessor. This is less than ideal but we have verified that it works in our test app and if anyone has any other ideas on how to do this with supported ember-cli APIs we would appreciate an issue or a PR. 

In `scoped-css-preprocessor.js` we provide a `ScopedCssPreprocessor` where we combine CSS from:

1. Other CSS preprocessors (e.g. `ember-css-modules`)
2. `ember-scoped-css`
3. `app.css`

#### Babel plugin - src/scoped-babel-plugin.js

We wanted our babel plugin to run after `ember-cli-htmlbars` and `ember-template-imports` plugins, because they transform all type of components (template only, GJS) to javascript file with `precompileTemplate` or `hbs` function. We have specified this in the `ember-addon/after` property in `package.json`. However we need the build to happen before the templates are converted all the way to wire format so we have to insert our babel directly after the correct babel plugin in the `included()` function of the addon.

### Support for embroider apps

The design of `ember-scoped-css` was explicitly intended to support embroider apps. We don't have "official" support for embroider apps right now but the design of the addon will allow us to easily integrate with embroider.

Right now the bulk of the implementation is exposed via an `unplugin` plugin which can easily be used to generate a webpack plugin that can be integrated into an embroider app. We haven't added this to our test apps yet because of time constraints but it should hopefully work out of the box without much tweaking.

### Important functions

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
  This is a work in progress.
