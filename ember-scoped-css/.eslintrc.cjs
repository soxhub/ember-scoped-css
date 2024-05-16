'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const nodeESM = configs.node();

// accommodates: JS, TS, App, Addon, and V2 Addon
module.exports = {
  overrides: [
    ...nodeESM.overrides,
    {
      files: ['./**/*.{js,ts}'],
      rules: {
        // These lints don't support one or more of
        // - TS 5
        // - `node:` imports
        'import/namespace': 'off',
        'import/no-cycle': 'off',
        'import/named': 'off',
        'import/default': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',

        // This doesn't support modern ESM
        'n/no-missing-import': 'off',
      },
    },
    {
      files: ['./test/**/*.js', '**/*.test.ts'],
      env: {
        mocha: true,
      },
      rules: {
        'n/no-unpublished-import': 'off',
        'node/no-unpublished-import': 'off',
      },
    },
  ],
};
