---
'ember-scoped-css-compat': patch
'ember-scoped-css': patch
---

Support customizing or disablying the CSS Layer that the generated CSS is palced in.

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
                  layerName: 'embroider-app'
                }
              },
            ],
          },
        ]
      }
      /* ... */
    },
  },
});
```

For more information on CSS Layers, checkout [the MDN Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
