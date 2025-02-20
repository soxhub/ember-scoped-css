'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const ember = configs.ember();

// accommodates: JS, TS, App, Addon, and V2 Addon
module.exports = {
  overrides: [
    ...ember.overrides,
    {
      files: ['**/*.gjs', '**/*.gts'],
      rules: {
        // scoped-class isn't defined, yet we allow it for build time.
        // scopedClass is importable, and removed at build time as well.
        'no-undef': 'off',
        // not relevant for what we're testing
        '@typescript-eslint/no-empty-object-type': 'off',
      },
    },
    {
      files: ['rollup.config.mjs'],
      rules: {
        // does not support package.json#exports
        'import/named': 'off',
      },
    },
  ],
};
