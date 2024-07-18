'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const app = new EmberApp(defaults, {
    name: 'test-app',
    // autoImport: {
    //   watchDependencies: ['v2-addon'],
    // },
    'ember-scoped-css': {
      additionalRoots: ['routes/'],
      layerName: 'test-app',
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
                    layerName: 'test-app',
                    additionalRoots: ['routes/'],
                  },
                },
              ],
            },
          ],
        },
      },
    },
  });
};
