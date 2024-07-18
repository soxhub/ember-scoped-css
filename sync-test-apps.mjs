import path from 'node:path';
import fs from 'node:fs/promises';

const cwd = process.cwd();
const source = 'test-apps/classic-app';
const sourceComponents = path.join(source, 'app/components');
const sourceTests = path.join(source, 'tests/shared-scenarios');

const otherApps = ['embroider-app', 'pods-classic-app', 'pods-embroider-app'];

async function sync(source, destination) {
  let target = path.join('../../', source).replace('/test-apps/', '/');

  console.log(target);

  await fs.rm(destination, { force: true, recursive: true });
  await fs.symlink(target, destination);
}

for (let app of otherApps) {
  await sync(
    sourceComponents,
    path.join(cwd, 'test-apps', app, 'app/components'),
  );

  await sync(
    sourceTests,
    path.join(cwd, 'test-apps', app, 'tests/shared-scenarios'),
  );
}
