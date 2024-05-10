'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const ember = configs.ember();

// accommodates: JS, TS, App, Addon, and V2 Addon
module.exports = {
  overrides: [
    ...ember.overrides,
    {
      files: ['**/*.gts'],
      plugins: ['ember'],
      parser: 'ember-eslint-parser',
    },
    {
      files: ['**/*.gjs'],
      plugins: ['ember'],
      parser: 'ember-eslint-parser',
    },
    {
      files: ['*.{cjs,js}'],
      rules: {
        'n/no-unsupported-syntax': 'off',
        'n/no-unsupported-features': 'off',
      },
    },
  ],
};
