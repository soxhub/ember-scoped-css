# ember-scoped-css

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
