#!/bin/bash

pnpm esbuild \
  src/scoped-babel-plugin.js \
  src/build/app-css-loader.js \
  src/build/app-dependency-loader.js \
  src/lib/scoped-css-preprocessor.js \
  src/runtime/test-support.js \
  --bundle --outdir=dist --platform=node \
  --out-extension:.js=.cjs