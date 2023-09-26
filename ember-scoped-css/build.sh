#!/bin/bash

cp ../README.md ./README.md
cp ../LICENSE.md ./LICENSE.md

pnpm esbuild \
  src/scoped-babel-plugin.js \
  src/build/app-css-loader.js \
  src/build/app-dependency-loader.js \
  src/lib/scoped-css-preprocessor.js \
  src/runtime/test-support.js \
  --bundle --outdir=dist --platform=node --sourcemap \
  --out-extension:.js=.cjs
