# ember-scoped-css

## 0.17.4

### Patch Changes

- [#159](https://github.com/soxhub/ember-scoped-css/pull/159) [`64ac1a2`](https://github.com/soxhub/ember-scoped-css/commit/64ac1a2d94a48befbb039a8261ffa24995ea2f25) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Fix issue where importing scopedClass was not supported in classic apps as the feature was only implemented for v2 addons

## 0.17.3

### Patch Changes

- [#158](https://github.com/soxhub/ember-scoped-css/pull/158) [`841f131`](https://github.com/soxhub/ember-scoped-css/commit/841f131185682ec2af198e4b9c95d3969cc1e8bc) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Add declarations to the files list in package.json

- [#156](https://github.com/soxhub/ember-scoped-css/pull/156) [`f1bf095`](https://github.com/soxhub/ember-scoped-css/commit/f1bf095e115fd52ad9aaccd5bf90d2c45fa0a30e) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Attempt 2 and fixing declaration emit

## 0.17.2

### Patch Changes

- [#154](https://github.com/soxhub/ember-scoped-css/pull/154) [`5c9fd13`](https://github.com/soxhub/ember-scoped-css/commit/5c9fd1394503d0dbf01bc8456267de26b384e711) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Add prepack script to attempt to get the declarations built along with publish

## 0.17.1

### Patch Changes

- [#151](https://github.com/soxhub/ember-scoped-css/pull/151) [`cb54e6d`](https://github.com/soxhub/ember-scoped-css/commit/cb54e6d8e045cb7b8049a47e1bff04e2264c1ced) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Fix the live reload behavior of classic ember apps when editing the CSS for a corresponding gjs and gts file

## 0.17.0

### Minor Changes

- [#144](https://github.com/soxhub/ember-scoped-css/pull/144) [`880a0b9`](https://github.com/soxhub/ember-scoped-css/commit/880a0b94c0ebbd2d06e28b0fa35ef2f848817156) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Moves to content-tag, the same template tag parser used for all of ember's tooling

- [#147](https://github.com/soxhub/ember-scoped-css/pull/147) [`ed8730f`](https://github.com/soxhub/ember-scoped-css/commit/ed8730f2e4a83fe59b0ba4dd916aee4c12459454) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Support `gjs` and `gts` (`<template>`) by allowing an import for `scopedClass`.

  Example usage:

  ```gjs
  import { scopedClass } from 'ember-scoped-css';

  <template>
    <p class={{scopedClass "hi"}}>text color</p>
  </template>
  ```

## 0.16.0

### Minor Changes

- [#140](https://github.com/soxhub/ember-scoped-css/pull/140) [`b86dfe5`](https://github.com/soxhub/ember-scoped-css/commit/b86dfe5702a2e63b301b790b9e8adc7e87916841) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Fix TypeScript / Glint support.
  There is now a template-registry that folks can import for loose-mode components:

  ```ts
  import 'ember-source/types';
  import 'ember-source/types/preview';

  import type ScopedCss from 'ember-scoped-css/template-registry';

  declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry extends ScopedCss {
      // ...
    }
  }
  ```

  Note that the `scoped-class` helper is removed at build time, so you should never see it at runtime. The types here are to satisfy correctness/type checking/lints.

### Patch Changes

- [#140](https://github.com/soxhub/ember-scoped-css/pull/140) [`3a66d3a`](https://github.com/soxhub/ember-scoped-css/commit/3a66d3ae44a17ed25bdd8f2e8fae308d8317be35) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Fixes #108. ember-scoped-css is now compatible with `@embroider/addon-dev@v4`, which means that `rollup-plugin-glimmer-template-tag` is no longer needed, and also no longer recommended in the README. For GJS/GTS/`<template>`, please use `@embroider/addon-dev`'s `addon.gjs()` plugin.

## 0.15.0

### Minor Changes

- [#129](https://github.com/soxhub/ember-scoped-css/pull/129) [`e0ae8e3`](https://github.com/soxhub/ember-scoped-css/commit/e0ae8e33af7072f54586c00aede887034e911503) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Fix issue where sufficiently modern JS would not be parseable by scoped-css' build processes.

  Folks would run in to this if they ship code with untranspiled

  - static initializer blocks
  - private fields

  Both these ecma features are supported everywhere, so it's reasonable that folks would expect their tooling to support parsing those features.

## 0.14.0

### Minor Changes

- [#116](https://github.com/soxhub/ember-scoped-css/pull/116) [`bd1ead6`](https://github.com/soxhub/ember-scoped-css/commit/bd1ead6f5af96ea0eb09b60bcd907c7e36c0ba43) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Adds pods support for classic ember builds.

## 0.13.0

### Minor Changes

- [#113](https://github.com/soxhub/ember-scoped-css/pull/113) [`fc99101`](https://github.com/soxhub/ember-scoped-css/commit/fc99101560a313f52c426dc95032f40a94d1e754) Thanks [@jakebixby](https://github.com/jakebixby)! - Bumped ember-template-tag@2.3.15 for type fix

- [#111](https://github.com/soxhub/ember-scoped-css/pull/111) [`3ac8b63`](https://github.com/soxhub/ember-scoped-css/commit/3ac8b63e3ba22ff60a073e4188b1873e112d9dd3) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Utilize `external` dependencies for a more optimized runtime and install time / size

## 0.12.1

### Patch Changes

- [#102](https://github.com/soxhub/ember-scoped-css/pull/102) [`3ca5674`](https://github.com/soxhub/ember-scoped-css/commit/3ca5674215487b43d9f62f18ae2310bbe0315467) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Fix an issue with strings in `class` attributes declared via sub-expressions (such as within if statements), were not properly getting scoped.

  For example:

  ```js
  <template>
    <div class="global-probably {{if @condition "a-local-class"}}">
      Hello there!
    </div>
  </template>
  ```

  When the sibling CSS file only declares `a-local-class`, we would expect that

  - `global-probably` remains unchanged
  - `a-local-class` gets hashed

  Note that this bug is not fixed for embroider consumers.

## 0.12.0

### Minor Changes

- [#95](https://github.com/soxhub/ember-scoped-css/pull/95) [`845ecb8`](https://github.com/soxhub/ember-scoped-css/commit/845ecb88f70a3412445773167aebbc1dd8ebcf86) Thanks [@jakebixby](https://github.com/jakebixby)! - added postProcess hook to scoped-css-preprocessor to break cache for associated template file

## 0.11.2

### Patch Changes

- [#74](https://github.com/soxhub/ember-scoped-css/pull/74) [`6b0294d`](https://github.com/soxhub/ember-scoped-css/commit/6b0294dc26fb07799a87b5de22ec28a17285cb7a) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Support customizing or disablying the CSS Layer that the generated CSS is palced in.

  The default `layerName` is `'components'`, but can be disabled entirely by setting to `false`.

  **In Classic Apps**:

  ```js
  const app = new EmberApp(defaults, {
    // Add options here
    'ember-scoped-css': {
      layerName: 'classic-app-layer',
    },
  });
  ```

  **In V2 Addons**

  ```js
  scopedCssUnplugin.rollup({
    layerName: 'utilities',
  });
  ```

  **In Embroider Apps**

  ```js
  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    /* ... */
    packagerOptions: {
      /* ... */
      webpackConfig: {
        /* ... */
        module: {
          rules: [
            /* ... */
            {
              test: /\.css$/,
              use: [
                {
                  loader: require.resolve(
                    'ember-scoped-css/build/app-css-loader',
                  ),
                  options: {
                    layerName: 'embroider-app',
                  },
                },
              ],
            },
          ],
        },
        /* ... */
      },
    },
  });
  ```

  For more information on CSS Layers, checkout [the MDN Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)

## 0.11.1

### Patch Changes

- [#60](https://github.com/soxhub/ember-scoped-css/pull/60) [`95dbe7a`](https://github.com/soxhub/ember-scoped-css/commit/95dbe7a5d65122b593fca767afd4d34cf00e9f0b) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Add README to the published package

- [#64](https://github.com/soxhub/ember-scoped-css/pull/64) [`cb8b46c`](https://github.com/soxhub/ember-scoped-css/commit/cb8b46ceb424dc098e033f32bfb8ac6cbcf02677) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Add support for \*.hbs files in non-embroider apps. Embroider already supported hbs / template-only components

## 0.11.0

### Minor Changes

- [`55d09ea`](https://github.com/soxhub/ember-scoped-css/commit/55d09ea84b6ce4fc0feb7231eb25dfde6ed8471a) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Normalize on module paths for `scopedClass` as well as hash generation.

  To migrate:

  ```diff
      assert
        .dom('h1')
  -     .hasClass(scopedClass('test-header', 'classic-app/components/header.css'));
  +     .hasClass(scopedClass('test-header', 'classic-app/components/header'));
  ```

## 0.10.1

### Patch Changes

- [#53](https://github.com/soxhub/ember-scoped-css/pull/53) [`09282f8`](https://github.com/soxhub/ember-scoped-css/commit/09282f8d1b476ddb88777f5c8657a0fba3c1b923) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Publish 'dist' as well as 'src', as 'dist' contains the cjs variants of the build tools

## 0.10.0

### Minor Changes

- [#50](https://github.com/soxhub/ember-scoped-css/pull/50) [`da51618`](https://github.com/soxhub/ember-scoped-css/commit/da516183b564ac92e3993ed62e249d3f15ee1d00) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Support importing scopedClass in tests
