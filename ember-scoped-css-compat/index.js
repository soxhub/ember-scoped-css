'use strict';

const {
  default: ScopedCssPreprocessor,
} = require('ember-scoped-css/build/ember-classic-support');

module.exports = {
  name: require('./package').name,

  init() {
    this._super.init && this._super.init.apply(this, arguments);
    this.outputStylePreprocessor = new ScopedCssPreprocessor({
      owner: this,
    });
  },

  included() {
    this._super.included.apply(this, arguments);

    let plugins = this.app.options.babel.plugins;

    if (plugins) {
      let htmlbarsPlugin = plugins.find(
        (p) => p._parallelBabel?.params?.templateCompilerPath,
      );

      if (htmlbarsPlugin) {
        let htmlbarsPluginIndex = plugins.indexOf(htmlbarsPlugin);
        let scopedCssOptions = this.app.options['ember-scoped-css'] || {};


        let customPlugin = [require.resolve('ember-scoped-css/babel-plugin'), {
          ...scopedCssOptions
        }];

        plugins.splice(htmlbarsPluginIndex, 0, customPlugin);
      }
    }
  },

  setupPreprocessorRegistry(type, registry) {
    // Skip if we're setting up this addon's own registry
    if (type !== 'parent') {
      return;
    }

    let scopedCssOptions = this.app.options['ember-scoped-css'] || {};

    // we need to run our css preprocessor first, so we removed all other from the registry and run them as part of our preprocessor
    // we did not find other way how to do it more elegantly
    let preprocessors = registry.load('css');

    preprocessors.forEach((p) => registry.remove('css', p));

    this.outputStylePreprocessor.configureOptions(scopedCssOptions);

    this.outputStylePreprocessor.preprocessors = preprocessors;
    registry.add('css', this.outputStylePreprocessor);
  },
};
