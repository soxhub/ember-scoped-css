import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { findWorkspacePath } from './utils.js';
import { paths } from './utils.paths.test.js';

describe('findWorkspacePath()', () => {
  it('from a component', () => {
    let file = path.join(paths.embroiderApp, 'app/components/forth.gjs');
    let result = findWorkspacePath(file, { cwd: paths.embroiderApp });

    expect(result).toBe(paths.embroiderApp);
  });

  it('from a component with app in the name', () => {
    let file = path.join(paths.embroiderApp, 'app/components/page/app.gjs');
    let result = findWorkspacePath(file, { cwd: paths.embroiderApp });

    expect(result).toBe(paths.embroiderApp);
  });

  it('from a component with app in the path', () => {
    let file = path.join(
      paths.embroiderApp,
      'app/components/app/page/forth.gjs',
    );
    let result = findWorkspacePath(file, { cwd: paths.embroiderApp });

    expect(result).toBe(paths.embroiderApp);
  });

  it('from an unrelated path', () => {
    let file = path.join(
      paths.embroiderApp,
      'app/components/app/page/forth.gjs',
    );
    let result = findWorkspacePath(file, { cwd: paths.classicApp });

    expect(result).toBe(paths.embroiderApp);
  });

  it('from an unrelated CWD', () => {
    let file = path.join(paths.classicApp, 'app/components/app/page/forth.gjs');
    let result = findWorkspacePath(file, { cwd: paths.embroiderApp });

    expect(result).toBe(paths.classicApp);
  });

  it('from outside the CWD entirely', () => {
    expect(() => {
      let file = path.join('/tmp/app/components/app/page/forth.gjs');

      findWorkspacePath(file, { cwd: paths.classicApp });
    }).toThrowError(/Could not determine project/);
  });
});
