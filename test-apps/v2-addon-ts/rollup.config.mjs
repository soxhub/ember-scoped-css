import typescript from 'rollup-plugin-ts';
import copy from 'rollup-plugin-copy';
import { Addon } from '@embroider/addon-dev/rollup';
import { glimmerTemplateTag } from 'rollup-plugin-glimmer-template-tag';
import { scopedCssUnplugin } from 'ember-scoped-css/build';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default {
  // This provides defaults that work well alongside `publicEntrypoints` below.
  // You can augment this if you need to.
  output: addon.output(),

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    addon.publicEntrypoints([
      'components/**/*.js',
      'index.js',
      'template-registry.js',
    ]),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    addon.appReexports(['components/**/*.js']),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),

    // compile TypeScript to latest JavaScript, including Babel transpilation
    typescript({
      transpiler: 'babel',
      browserslist: false,
      transpileOnly: true,
    }),

    // Ensure that standalone .hbs files are properly integrated as Javascript.
    addon.hbs(),
    glimmerTemplateTag(),

    // addon.keepAssets(['**/*.css']),
    scopedCssUnplugin.rollup(),

    // Remove leftover build artifacts when starting a new build.
    addon.clean(),

    // Copy Readme and License into published package
    copy({
      targets: [
        { src: '../README.md', dest: '.' },
        { src: '../LICENSE.md', dest: '.' },
      ],
    }),
  ],
};
