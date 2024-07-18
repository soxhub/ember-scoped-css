import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { hashFromAbsolutePath } from './hash-from-absolute-path.js';
import { hashFromModulePath } from './hash-from-module-path.js';
import { paths } from './utils.paths.test.js';

describe('hashFromAbsolutePath', () => {
  describe(`the module: "embroider-app/templates/application"`, () => {
    let file = 'templates/application';
    let expected = 'ea418816b';

    it('matches the module path', () => {
      let postfix = hashFromModulePath(`test-app/${file}`);

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
