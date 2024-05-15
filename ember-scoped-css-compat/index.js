'use strict';

const hashObj = require('hash-obj');
const fs = require('fs');

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
    this._setupJSPlugins(registry, options);
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

  _setupJSPlugins(registry, options) {
    registry.add('js', new JSPreprocessor(options));
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

const stew = require('broccoli-stew');
const babel = require('@babel/core');

class JSPreprocessor {
  constructor(options) {
    this.options = options;
  }

  toTree(tree) {
    let updated = stew.map(tree, '**/*.{js}', (string, relativePath) => {
      console.log({ string, relativePath });

      let cssPath = relativePath.replace(/\.js$/, '.css');

      if (fs.existsSync(cssPath)) {
        /**
         * This is slow to cause a whole parse again,
         * so we only want to do it when we know we have a CSS file.
         *
         * The whole babel situation with embroider (pre v4) and classic ember,
         * is... just a mess. So we're skirting around it and inserting our code
         * as early as possible.
         */
        let result = babel.transformSync('code', {
          plugins: [
            [
              require.resolve('ember-scoped-css/babel-plugin'),
              {
                ...this.options,
              },
            ],
          ],
        });

        return result.code;
      }

      return string;
    });

    return updated;
  }
}
