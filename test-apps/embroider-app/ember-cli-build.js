'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { appJsUnplugin } = require('ember-scoped-css');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // autoImport: {
    //   watchDependencies: ['v2-addon'],
    // },
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
        plugins: [appJsUnplugin.webpack({ appDir: __dirname })],
        module: {
          rules: [
            // css loaders for production
            {
              test: /\.css$/,
              use: [
                {
                  loader: require.resolve(
                    'ember-scoped-css/src/app-css-loader'
                  ),
                },
              ],
            },
            {
              test: /(\.hbs)|(\.js)$/,
              use: [
                {
                  loader: require.resolve(
                    'ember-scoped-css/src/app-dependency-loader'
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
