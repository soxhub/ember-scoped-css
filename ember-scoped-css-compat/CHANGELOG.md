# ember-scoped-css-compat

## 3.0.0

### Patch Changes

- Updated dependencies [[`845ecb8`](https://github.com/soxhub/ember-scoped-css/commit/845ecb88f70a3412445773167aebbc1dd8ebcf86)]:
  - ember-scoped-css@0.12.0

## 2.0.1

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
                    'ember-scoped-css/build/app-css-loader'
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

- Updated dependencies [[`6b0294d`](https://github.com/soxhub/ember-scoped-css/commit/6b0294dc26fb07799a87b5de22ec28a17285cb7a)]:
  - ember-scoped-css@0.11.2

## 2.0.0

### Patch Changes

- Updated dependencies [[`55d09ea`](https://github.com/soxhub/ember-scoped-css/commit/55d09ea84b6ce4fc0feb7231eb25dfde6ed8471a)]:
  - ember-scoped-css@0.11.0

## 1.0.0

### Minor Changes

- [#50](https://github.com/soxhub/ember-scoped-css/pull/50) [`da51618`](https://github.com/soxhub/ember-scoped-css/commit/da516183b564ac92e3993ed62e249d3f15ee1d00) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Support importing scopedClass in tests

### Patch Changes

- Updated dependencies [[`da51618`](https://github.com/soxhub/ember-scoped-css/commit/da516183b564ac92e3993ed62e249d3f15ee1d00)]:
  - ember-scoped-css@0.10.0
