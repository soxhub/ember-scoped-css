import * as esbuild from 'esbuild';
import { createRequire as topLevelCreateRequire } from 'module';

const require = topLevelCreateRequire(import.meta.url);

const buildFiles = [
  'src/build/index.js',
  'src/build/app-css-loader.js',
  'src/build/app-dependency-loader.js',
  'src/lib/scoped-css-preprocessor.js',
  'src/scoped-babel-plugin.js',
];

const external = [...Object.keys(require('./package.json').dependencies)];

// Node, CJS
await esbuild.build({
  entryPoints: buildFiles,
  bundle: true,
  outdir: 'dist/cjs',
  format: 'cjs',
  platform: 'node',
  sourcemap: true,
  outExtension: { '.js': '.cjs' },
  external,
});

// Node, ESM
await esbuild.build({
  entryPoints: buildFiles,
  bundle: true,
  outdir: 'dist/esm',
  format: 'esm',
  target: 'esnext',
  platform: 'node',
  sourcemap: true,
  external,
  outExtension: { '.js': '.mjs' },
  /**
   * Ooof, this makes it feel like ESBuild doesn't have sufficient funding...
   */
  banner: {
    js: `
        import * as __url__ from 'url';
        import { createRequire as topLevelCreateRequire } from 'module';
        const require = topLevelCreateRequire(import.meta.url);
        const __filename = __url__.fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        `,
  },
});

// Runtime
await esbuild.build({
  entryPoints: ['src/runtime/test-support.ts'],
  sourcemap: true,
  format: 'esm',
  bundle: true,
  external,
  outdir: 'dist/runtime',
});
