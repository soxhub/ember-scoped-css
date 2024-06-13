'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const app = new EmberApp(defaults, {
    // autoImport: {
    //   watchDependencies: ['v2-addon'],
    // },
    'ember-scoped-css': {
      additionalRoots: ['routes/'],
      layerName: 'emborider-app',
    },
  });

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
