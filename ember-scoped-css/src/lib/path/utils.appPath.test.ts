import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { appPath } from './utils.js';
import { paths } from './utils.paths.test.js';

describe('appPath()', () => {
  it('handles embroider-re-written-app', () => {
    let file = path.join(
      paths.embroiderApp,
      paths.rewritten,
      'templates/application',
    );
    let result = appPath(file);

    expect(result).to.equal('embroider-app/templates/application');
  });

  it('handles extraneous /app/', () => {
    let file = path.join(paths.embroiderApp, 'app', 'templates/application');
    let result = appPath(file);

    expect(result).to.equal('embroider-app/templates/application');
  });

  it('handles psuedo module', () => {
    let file = path.join(paths.embroiderApp, 'templates/application');
    let result = appPath(file);

    expect(result).to.equal('embroider-app/templates/application');
  });
});
