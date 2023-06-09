"use strict";

const {
  default: ScopedCssPreprocessor,
} = require("../dist/lib/scoped-css-preprocessor.cjs");

module.exports = {
  name: "ember-scoped-css",

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
        (p) => p._parallelBabel?.params?.templateCompilerPath
      );

      if (htmlbarsPlugin) {
        let htmlbarsPluginIndex = plugins.indexOf(htmlbarsPlugin);

        let customPlugin = [require.resolve("../dist/scoped-babel-plugin.cjs")];

        plugins.splice(htmlbarsPluginIndex, 0, customPlugin);
      }
    }
  },

  setupPreprocessorRegistry(type, registry) {
    // Skip if we're setting up this addon's own registry
    if (type !== "parent") {
      return;
    }

    // we need to run our css preprocessor first, so we removed all other from the registry and run them as part of our preprocessor
    // we did not find other way how to do it more elegantly
    let preprocessors = registry.load("css");

    preprocessors.forEach((p) => registry.remove("css", p));
    this.outputStylePreprocessor.preprocessors = preprocessors;
    registry.add("css", this.outputStylePreprocessor);
  },
};
