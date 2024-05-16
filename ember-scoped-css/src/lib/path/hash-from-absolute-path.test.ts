import path from 'node:path';
import url from 'node:url';

import { describe, expect, it } from 'vitest';

import { hashFromAbsolutePath } from './hash-from-absolute-path.js';
import { hashFromModulePath } from './hash-from-module-path.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const monorepoRoot = path.join(__dirname, '../../../../');

const paths = {
  embroiderApp: path.join(monorepoRoot, 'test-apps/embroider-app'),
};

describe('hashFromAbsolutePath', () => {
  describe(`the module: "embroider-app/templates/application"`, () => {
    let file = 'templates/application';
    let expected = 'ea418816b';

    it('matches the module path', () => {
      let postfix = hashFromModulePath(`embroider-app/${file}`);

      expect(postfix).to.equal(expected);
    });

    it('works with rewritten app', () => {
      let filePath = path.join(
        paths.embroiderApp,
        '/node_modules/.embroider/rewritten-app',
        file,
      );
      let postfix = hashFromAbsolutePath(filePath);

      expect(postfix).to.equal(expected);
    });

    it('works with direct path', () => {
      let filePath = path.join(paths.embroiderApp, 'app', file);
      let postfix = hashFromAbsolutePath(filePath);

      expect(postfix).to.equal(expected);
    });
  });
});
