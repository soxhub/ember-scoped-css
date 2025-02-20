import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { scopedCssUnplugin as scopedCSS } from 'ember-scoped-css/build';

export default defineConfig({
  resolve: {
    extensions,
  },
  plugins: [
    //scopedCSS.vite(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
