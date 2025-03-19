'use strict';

const {
  default: ScopedCssPreprocessor,
} = require('ember-scoped-css/build/ember-classic-support');

/**
 * There are 3 transforms wired up in here
 * - Babel
 *   - to automatically add an import to the sibling file
 *   - to remove any imports from ember-scoped-css
 * - Template
 *   - To swap out scoped-class / scopedClass usage with postfixed variants
 * - CSS
 *   - to Add postfixed class names to each class / selector
 */
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

        let customPlugin = [
          require.resolve('ember-scoped-css/babel-plugin'),
          {
            ...scopedCssOptions,
          },
        ];

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
    // we did not find other way how to do it more elegantly. Also in later ember-cli versions this array becomes a live reference
    // so removing them from the registry actually removes them from this reference 😱 so we need to make a deep copy here
    let preprocessors = [...registry.load('css')];

    preprocessors.forEach((p) => registry.remove('css', p));

    this.outputStylePreprocessor.configureOptions(scopedCssOptions);

    this.outputStylePreprocessor.preprocessors = preprocessors;
    registry.add('css', this.outputStylePreprocessor);

    installScopedCSS(registry, scopedCssOptions);
  },
};

function installScopedCSS(registry, options) {
  registry.add('htmlbars-ast-plugin', buildHBSPlugin(options));
}

function buildHBSPlugin(config = {}) {
  let thePlugin = require('ember-scoped-css/template-plugin').createPlugin(
    config,
  );

  return {
    name: 'ember-scoped-css::template-plugin',
    plugin: thePlugin,
    baseDir() {
      return __dirname;
    },
    parallelBabel: {
      requireFile: __filename,
      buildUsing: 'buildHBSPlugin',
      params: config,
    },
  };
}

module.exports.buildHBSPlugin = buildHBSPlugin;
module.exports.installScopedCSS = installScopedCSS;
