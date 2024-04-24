import fsSync from 'node:fs';
import path from 'node:path';

import findUp from 'find-up';

import {generateRelativePathHash as generateHash } from './generateRelativePathHash.js';

export default function generateHashFromAbsolutePath(absolutePath) {
  /**
   * The whole of `appPath` ultimately transforms the `absolutePath`
   * into the exact string that folks will pass to `relativePath`
   * at runtime.
   */
  const modulePath = appPath(absolutePath);

  const hash = generateHash(modulePath);

  return hash;
}

export function packageScopedPathToModulePath(packageScopedPath) {
  /**
   * *By convention*, `src` is omitted from component paths.
   * We can reflect the same behavior by replacing src/
   * with an empty string.
   *
   * CSS isn't emitted as a co-located module, but
   * to keep conventions consistent across languages,
   * we can pretend it is.
   *
   * Any customization beyond removing `src` and `app` is potentially confusing.
   * If we need further customizations, we'll want to match on `exports` in the
   * corresponding package.json
   */
  let packageRelative = packageScopedPath.replace(/^\/src\//, '/');

  let parsed = path.parse(packageRelative);

  /**
   * Pods support.
   * For pods, we chop off the whole file, and use the dir name as the "modulePath"
   *
   * Note that pods for components will never be supported.
   */
  let isPod =
    !packageRelative.includes('/components/') &&
    (packageRelative.endsWith('styles.css') ||
      packageRelative.endsWith('template.hbs') ||
      packageRelative.endsWith('template.js'));

  if (isPod) {
    return parsed.dir;
  }

  /**
   * If an extension is passed, remove it.
   * When using packagers, folks are used to not having to specify extensions for files.
   * Since we don't even emit css files co-located to each module,
   * this helps us not convey a lie that a file may exist in at runtime.
   *
   * For example `<module-name>/components/button`.
   * It doesn't matter what the extension is, because you can only have one css file
   * for the button module anyway.
   */
  let localPackagerStylePath = path.join(parsed.dir, parsed.name);

  return localPackagerStylePath;
}

/**
 * returns the app-module path of the source file
 *
 * This assumes normal ember app conventions
 *
 * which is `<package.json#name>/path-to-file`
 */
export function appPath(sourcePath) {
  let workspacePath = findWorkspacePath(sourcePath);
  let name = workspacePackageName(sourcePath);

  /**
   *  Under embroider builds, the spec-compliant version of the app
   * has all the files under a folder which represents the package name,
   * rather than "app".
   */
  let packageRelative = sourcePath.replace(workspacePath, '');

  let localPackagerStylePath = packageScopedPathToModulePath(packageRelative);

  return `${name}${localPackagerStylePath}`;
}

const CACHE = new Set();

/**
 * For a given source path, if we have seen a
 * source file within the workspace directory,
 * find that workspace directory and return it.
 */
function hasSeen(sourcePath) {
  for (let entry of CACHE) {
    if (sourcePath.startsWith(entry)) {
      return entry;
    }
  }

  // we have not seen this source path yet
  return;
}

/**
 * Populates the "seen" workspace cache,
 * so that we don't hit the file system too often.
 */
function findWorkspacePath(sourcePath) {
  let seen = hasSeen(sourcePath);

  if (seen) {
    return seen;
  }

  const packageJsonPath = findUp.sync('package.json', {
    cwd: path.dirname(sourcePath),
  });

  const workspacePath = path.dirname(packageJsonPath);

  CACHE.add(workspacePath);

  return workspacePath;
}

const MANIFEST_CACHE = new Map();

/**
 * returns the package.json#name for a given sourcePath
 */
function workspacePackageName(sourcePath) {
  const workspace = findWorkspacePath(sourcePath);

  let existing = MANIFEST_CACHE.get(workspace);

  if (existing) {
    return existing.name;
  }

  let buffer = fsSync.readFileSync(path.join(workspace, 'package.json'));
  let content = buffer.toString();
  let json = JSON.parse(content);

  MANIFEST_CACHE.set(workspace, json);

  return json.name;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('should return a string', function () {
    const postfix = generateHash('foo.css');

    expect(postfix).to.be.a('string');
  });

  it('should return a string starting with "e"', function () {
    const postfix = generateHash('foo.css');

    expect(postfix).to.match(/^e/);
  });

  it('should return a string of length 9', function () {
    const postfix = generateHash('foo.css');

    expect(postfix).to.have.lengthOf(9);
  });
}
