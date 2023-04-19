'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  plugins: ['node'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended-module'
  ],
  env: {
    browser: false,
    node: true,
  },
  rules: {
  },
  overrides: [
    {
      files: [
        './test/**/*.js',
      ],
      env: {
        mocha: true,
      },
      rules: {
        'node/no-unpublished-import': 0,
      }
    },
  ],
};
