import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { fixFilename } from './template-transform-paths.js';
import { paths } from './utils.paths.test.js';

describe('fixFilename()', () => {
  it('works with embroider paths', () => {
    let file = path.join(
      paths.embroiderApp,
      paths.rewritten,
      'components/template-only.hbs',
    );
    let corrected = fixFilename(file);

    expect(corrected).to.equal(
      path.join(paths.embroiderApp, 'app/components/template-only.hbs'),
    );
  });

  it('works with the real path', () => {
    let file = path.join(
      paths.classicApp,
      'app',
      'components/template-only.hbs',
    );
    let corrected = fixFilename(file);

    expect(corrected).to.equal(
      path.join(paths.classicApp, 'app/components/template-only.hbs'),
    );
  });

  it('is not confused with "app" in the component path', () => {
    let file = path.join(
      paths.classicApp,
      'app',
      'components/app/page/template-only.hbs',
    );
    let corrected = fixFilename(file);

    expect(corrected).to.equal(
      path.join(paths.classicApp, 'app/components/app/page/template-only.hbs'),
    );
  });

  it('works with classic paths (w/ module name)', () => {
    let file = path.join(
      paths.classicApp,
      'classic-app',
      'components/template-only.hbs',
    );
    let corrected = fixFilename(file);

    expect(corrected).to.equal(
      path.join(paths.classicApp, 'app/components/template-only.hbs'),
    );
  });

  it('is not confused with "app" in the component path (w/ module name)', () => {
    let file = path.join(
      paths.classicApp,
      'classic-app',
      'components/app/page/template-only.hbs',
    );
    let corrected = fixFilename(file);

    expect(corrected).to.equal(
      path.join(paths.classicApp, 'app/components/app/page/template-only.hbs'),
    );
  });
});
