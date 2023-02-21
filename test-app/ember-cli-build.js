'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const {
  appJsUnplugin,
  appCssUnplugin,
  appScopedcssWebpack,
} = require('ember-scoped-css');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['test-addon'],
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
      webpackConfig: {
        plugins: [
          appJsUnplugin.webpack({ appDir: __dirname }),
          appCssUnplugin.webpack({ appDir: __dirname }),
          new appScopedcssWebpack(),
          new CopyWebpackPlugin({
            patterns: [
              {
                from: 'node_modules/test-addon/dist/scoped.css',
                to: 'assets/test-addon',
              },
            ],
          }),
        ],
        module: {
          rules: [
            {
              test: /(\.js)|(\.hbs)$/,
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
