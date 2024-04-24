# ember-scoped-css-compat

## 9.0.0

### Patch Changes

- Updated dependencies [[`c96c89b`](https://github.com/soxhub/ember-scoped-css/commit/c96c89b85e1d943481cd5b4d92cd55f24fa8ca68)]:
  - ember-scoped-css@0.18.0

## 8.0.0

### Patch Changes

- Updated dependencies [[`880a0b9`](https://github.com/soxhub/ember-scoped-css/commit/880a0b94c0ebbd2d06e28b0fa35ef2f848817156), [`ed8730f`](https://github.com/soxhub/ember-scoped-css/commit/ed8730f2e4a83fe59b0ba4dd916aee4c12459454)]:
  - ember-scoped-css@0.17.0

## 7.0.0

### Patch Changes

- Updated dependencies [[`b86dfe5`](https://github.com/soxhub/ember-scoped-css/commit/b86dfe5702a2e63b301b790b9e8adc7e87916841), [`3a66d3a`](https://github.com/soxhub/ember-scoped-css/commit/3a66d3ae44a17ed25bdd8f2e8fae308d8317be35)]:
  - ember-scoped-css@0.16.0

## 6.0.0

### Patch Changes

- Updated dependencies [[`e0ae8e3`](https://github.com/soxhub/ember-scoped-css/commit/e0ae8e33af7072f54586c00aede887034e911503)]:
  - ember-scoped-css@0.15.0

## 5.0.0

### Patch Changes

- Updated dependencies [[`bd1ead6`](https://github.com/soxhub/ember-scoped-css/commit/bd1ead6f5af96ea0eb09b60bcd907c7e36c0ba43)]:
  - ember-scoped-css@0.14.0

## 4.0.0

### Patch Changes

- Updated dependencies [[`fc99101`](https://github.com/soxhub/ember-scoped-css/commit/fc99101560a313f52c426dc95032f40a94d1e754), [`3ac8b63`](https://github.com/soxhub/ember-scoped-css/commit/3ac8b63e3ba22ff60a073e4188b1873e112d9dd3)]:
  - ember-scoped-css@0.13.0

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
