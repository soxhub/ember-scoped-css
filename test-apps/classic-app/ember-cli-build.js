'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // All our test-apps must have the same name
    // so that we can ensure that moving between configurations
    // causes no string-comparison headaches.
    name: 'test-app',
    // Add options here
    cssModules: {
      extension: 'module.css',
    },
    autoImport: {
      allowAppImports: ['*.css'],
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    'ember-scoped-css': {
      layerName: 'test-app',
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('node_modules/v2-addon/dist/scoped.css');

  return app.toTree();
};
