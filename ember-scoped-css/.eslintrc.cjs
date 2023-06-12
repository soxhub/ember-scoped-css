'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const nodeESM = configs.node();

// accommodates: JS, TS, App, Addon, and V2 Addon
module.exports = {
  overrides: [
    ...nodeESM.overrides,

    {
      files: ['./test/**/*.js'],
      env: {
        mocha: true,
      },
      rules: {
        'node/no-unpublished-import': 0,
      },
    },
  ],
};
