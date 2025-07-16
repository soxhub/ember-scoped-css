import * as esbuild from 'esbuild';
import { vitestCleaner } from 'esbuild-plugin-vitest-cleaner';
import { createRequire as topLevelCreateRequire } from 'module';

const require = topLevelCreateRequire(import.meta.url);

const buildFiles = [
  'src/build/index.js',
  'src/build/app-css-loader.js',
  'src/build/ember-classic-support.js',
  'src/build/babel-plugin.js',
  'src/build/template-plugin.js',
];

const toBundle = ['blueimp-md5'];

const external = [
  ...Object.keys(require('./package.json').dependencies),
].filter((x) => !toBundle.includes(x));

// Node, CJS
await esbuild.build({
  entryPoints: buildFiles,
  bundle: true,
  outdir: 'dist/cjs',
  format: 'cjs',
  platform: 'node',
  sourcemap: 'inline',
  outExtension: { '.js': '.cjs' },
  external,
  plugins: [vitestCleaner()],
});

// Runtime
await esbuild.build({
  entryPoints: ['src/runtime/test-support.ts', 'src/runtime/index.ts'],
  sourcemap: true,
  format: 'esm',
  bundle: true,
  external,
  plugins: [vitestCleaner()],
  outdir: 'dist/runtime',
});
