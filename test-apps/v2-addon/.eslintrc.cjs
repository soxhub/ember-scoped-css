"use strict";

const { configs } = require("@nullvoxpopuli/eslint-configs");

const ember = configs.ember();

// accommodates: JS, TS, App, Addon, and V2 Addon
module.exports = {
  overrides: [...ember.overrides],
};
