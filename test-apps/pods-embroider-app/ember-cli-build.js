'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const { appJsUnplugin } = await import('ember-scoped-css/build');

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
