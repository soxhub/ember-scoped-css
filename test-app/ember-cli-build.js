'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const {
  appJsUnplugin,
  appCssLoader,
  appCssLivereloadLoader,
} = require('ember-scoped-css');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // autoImport: {
    //   watchDependencies: ['test-addon'],
    // },
  });

  const { Webpack } = require('@embroider/webpack');

  const htmlEntrypointInfo = {
    htmlEntryPoint: null,
  };

  class CssLiveReloadWebpack extends Webpack {
    examineApp() {
      const appInfo = super.examineApp();

      htmlEntrypointInfo.htmlEntryPoint = appInfo.entrypoints.find(
        (ep) => ep.filename === 'index.html'
      );

      return appInfo;
    }
  }

  return require('@embroider/compat').compatBuild(app, CssLiveReloadWebpack, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      webpackConfig: {
        plugins: [
          appJsUnplugin.webpack({ appDir: __dirname }),
          appCssLivereloadLoader.webpack({
            appDir: __dirname,
            loaders: [appCssLoader],
            htmlEntrypointInfo,
          }),
        ],
        module: {
          rules: [
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
