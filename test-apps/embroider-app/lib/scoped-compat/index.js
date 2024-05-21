const { installScopedCSS } = require('ember-scoped-css/build/ember-classic-support');

module.exports = {
  name: require('./package').name,
  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      installScopedCSS(registry, {
        layerName: 'embroider-app',
        additionalRoots: ['routes'],
      });
    }
  },
};
