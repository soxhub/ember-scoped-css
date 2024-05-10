'use strict';

const hashObj = require('hash-obj');

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

  /**
   * setupPreprocessorRegistry is called before included
   * see https://github.com/ember-cli/ember-cli/issues/3701
   * as a workaround we ignore that hook and call this method from included
   */
  setupPreprocessorRegistry(type, registry) {
    // Skip if we're setting up this addon's own registry
    if (type !== 'parent') {
      return;
    }

    let options = this.app.options['ember-scoped-css'] || {};

    this._setupCSSPlugins(registry, options);
    this._setupHBSPlugins(registry, options);
  },

  _setupCSSPlugins(registry, options) {
    // we need to run our css preprocessor first, so we removed all other from the registry and run them as part of our preprocessor
    // we did not find other way how to do it more elegantly
    let preprocessors = registry.load('css');

    preprocessors.forEach((p) => registry.remove('css', p));

    this.outputStylePreprocessor.configureOptions(options);

    this.outputStylePreprocessor.preprocessors = preprocessors;
    registry.add('css', this.outputStylePreprocessor);
  },

  _setupHBSPlugins(registry, options) {
    let plugin = this._buildHBSPlugin(options);

    plugin.parallelBabel = {
      requireFile: __filename,
      buildUsing: '_buildHBSPlugin',
      params: options,
    };

    registry.add('htmlbars-ast-plugin', plugin);
  },

  _buildHBSPlugin(config = {}) {
    let thePlugin = require('ember-scoped-css/template-plugin').createPlugin(
      config,
    );

    return {
      name: 'ember-scoped-css::template-plugin',
      plugin: thePlugin,
      baseDir() {
        return __dirname;
      },
      cacheKey() {
        return cacheKeyForConfig(config);
      },
    };
  },
};

function cacheKeyForConfig(config) {
  let configHash = hashObj(config, {
    encoding: 'base64',
    algorithm: 'md5',
  });

  // TODO: we need the random because we expect hbs and js files to change when css changes.
  //       and those css files are not imported into js... so... no cache for us
  return `ember-scoped-css-${configHash}-${Math.random()}`;
}
