'use strict';

import ScopedCssPreprocessor from './lib/scoped-css-preprocessor.js';

module.exports = {
  name: 'ember-scoped-css',

  init() {
    this._super.init && this._super.init.apply(this, arguments);
    this.outputStylePreprocessor = new ScopedCssPreprocessor({
      owner: this,
    });
  },


  setupPreprocessorRegistry(type, registry) {
    // Skip if we're setting up this addon's own registry
    if (type !== 'parent') {
      return;
    }

    // we need to run our css preprocessor first, so we removed all other from the registry and run them as part of our preprocessor
    // we did not find other way how to do it more elegantly
    let preprocessors = registry.load('css');
    preprocessors.forEach((p) => registry.remove('css', p));
    this.outputStylePreprocessor.preprocessors = preprocessors;
    registry.add('css', this.outputStylePreprocessor);
    //preprocessor.forEach((p) => registry.add('css', p));
  },
};
