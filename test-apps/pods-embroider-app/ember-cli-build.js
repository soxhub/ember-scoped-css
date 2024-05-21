'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const app = new EmberApp(defaults, {
    // autoImport: {
    //   watchDependencies: ['v2-addon'],
    // },
    babel: {
      plugins: [
        [
          require.resolve('ember-scoped-css/babel-plugin'),
          { layerName: 'embroider-app' },
          'configured',
        ],
      ],
    },
  });

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      // css loaders for live reloading css
      webpackConfig: {
        cache: false,
        module: {
          rules: [
            // css loaders for production
            {
              test: /\.css$/,
              use: [
                {
                  loader: require.resolve(
                    'ember-scoped-css/build/app-css-loader',
                  ),
                  options: {
                    layerName: 'embroider-app',
                    additionalRoots: ['routes/'],
                  },
                },
              ],
            },
            {
              test: /(\.hbs)|(\.js)$/,
              use: [
                {
                  loader: require.resolve(
                    'ember-scoped-css/build/app-dependency-loader',
                  ),
                },
              ],
              exclude: [/node_modules/, /dist/, /assets/],
            },
          ],
        },
      },
    },
  });
};
