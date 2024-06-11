import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { isRelevantFile } from './utils.js';
import { paths } from './utils.paths.test.js';

describe('isRelevantFile()', () => {
  describe('the file is relevant', () => {
    it('for in-project files', () => {
      let file = path.join(paths.embroiderApp, 'app/components/forth.gjs');
      let result = isRelevantFile(file, { cwd: paths.embroiderApp });

      expect(result).toBeTruthy();
    });
  });

  describe('the file is not relevant', () => {
    it('for outside-of-project files', () => {
      let file = path.join(paths.v2Addon, 'dist/components/footer.js');
      let result = isRelevantFile(file, { cwd: paths.embroiderApp });

      expect(result).toBeFalsy();
    });

    it('for files in node_modules', () => {
      let file = path.join(
        paths.embroiderApp,
        'node_modules/ember-resources/dist/index.js',
      );
      let result = isRelevantFile(file, { cwd: paths.embroiderApp });

      expect(result).toBeFalsy();
    });

    it('for files in .embroider/rewritten-packages', () => {
      let file = path.join(
        paths.embroiderApp,
        'node_modules/.embroider/rewritten-packages/ember-source/dist/index.js',
      );
      let result = isRelevantFile(file, { cwd: 'does not matter yet' });

      expect(result).toBeFalsy();
    });

    it('for files in .embroider/rewritten-app/assets/tests.js', () => {
      let file = path.join(
        paths.embroiderApp,
        'node_modules/.embroider/rewritten-app/assets/tests.js',
      );
      let result = isRelevantFile(file, { cwd: paths.embroiderApp });

      expect(result).toBeFalsy();
    });

    it('for files in tests/', () => {
      let file = path.join(paths.embroiderApp, 'tests/foo.js');
      let result = isRelevantFile(file, { cwd: paths.embroiderApp });

      expect(result).toBeFalsy();
    });
  });
});
