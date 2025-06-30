import { defineConfig } from 'vite';
import { babel } from '@rollup/plugin-babel';
import { scopedCSS } from 'ember-scoped-css/vite';

import { classicEmberSupport, ember, extensions } from '@embroider/vite';

export default defineConfig({
  resolve: {
    extensions,
  },
  plugins: [
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
    scopedCSS(),
  ],
});
