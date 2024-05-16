import fsSync from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

import findUp from 'find-up';

import { hashFromAbsolutePath } from './hash-from-absolute-path.js';
import { hashFromModulePath } from './hash-from-module-path.js';

export { hashFromAbsolutePath } from './hash-from-absolute-path.js';
export { hashFromModulePath } from './hash-from-module-path.js';

/**
 * Regardless of what the filePath format is,
 * this will try to return the correct postfix.
 *
 * @param {string} filePath
 * @returns
 */
export function hashFrom(filePath) {
  if (filePath.startsWith('/')) {
    return hashFromAbsolutePath(filePath);
  }

  return hashFromModulePath(filePath);
}

export async function exists(path) {
  try {
    await stat(path);

    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Based on ember's component location conventions,
 * this function will provide a path for where we
 * expect the CSS to live.
 *
 * For co-located structure:
 *   - components/my-component.hbs
 *   - components/my-component.css
 *
 * For nested co-located structure
 *   - components/my-component/foo.hbs
 *   - components/my-component/foo.css
 *
 * For Pods routes structure
 *   - routes/my-route/template.{hbs,js}
 *   - routes/my-route/styles.css
 *
 * Deliberately not supported:
 *   - components w/ pods -- this is deprecated in 5.10
 *
 * @param {string} fileName - the hbs, js, gjs, gts or whatever co-located path.
 * @returns {string} - expected css path
 */
export function cssPathFor(fileName) {
  let withoutExt = withoutExtension(fileName);
  let cssPath = withoutExt + '.css';

  if (isPod(fileName)) {
    cssPath = fileName
      .replace(/template\.js$/, 'styles.css')
      .replace(/template\.hbs/, 'styles.css');
  }

  return cssPath;
}

/**
 * Note that components in the "pods" convention will
 * never be supported.
 *
 * @param {string} filePath
 */
export function isPodTemplate(filePath) {
  if (filePath.includes('/components/')) {
    return false;
  }

  return filePath.endsWith('template.js') || filePath.endsWith('template.hbs');
}

/**
 * Note that components in the "pods" convention will
 * never be supported.
 *
 * Checks if a file ends with
 * - template.js
 * - template.hbs
 * - styles.css
 *
 * @param {string} filePath
 */
export function isPod(filePath) {
  if (filePath.includes('/components/')) {
    return false;
  }

  if (isPodTemplate(filePath)) {
    return true;
  }

  return filePath.endsWith('styles.css');
}

/**
 *
 * @param {string} filePath
 * @returns the same path, but without the extension
 */
export function withoutExtension(filePath) {
  let parsed = path.parse(filePath);

  return path.join(parsed.dir, parsed.name);
}

const UNSUPPORTED_DIRECTORIES = new Set(['tests']);

/**
 *
 * @param {string} fileName
 * @param {string[]} [additionalRoots]
 * @returns
 */
export function isRelevantFile(fileName, additionalRoots) {
  let workspace = findWorkspacePath(fileName);

  let local = fileName.replace(workspace, '');
  let [, ...parts] = local.split('/').filter(Boolean);

  if (UNSUPPORTED_DIRECTORIES.has(parts[0])) {
    return false;
  }

  /**
   * Mostly pods support.
   * folks need to opt in to pods (routes), because every pods app can be configured differently
   */
  let roots = ['/components/', ...(additionalRoots || [])];

  if (!roots.some((root) => fileName.includes(root))) {
    return;
  }

  return true;
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

  if (isPod(packageRelative)) {
    /**
     * For pods, we chop off the whole file, and use the dir name as the "modulePath"
     */
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

  /**
   * But we also don't want 'app' -- which is present in the v1 addon pipeline
   */
  packageRelative = packageRelative.replace(`/app/`, `/`);

  /**
   * also also, we know that the re-written app structure in embroider@v3
   * is extraneous, and we can collapse it
   */
  packageRelative = packageRelative.replace(
    `/node_modules/.embroider/rewritten-app/`,
    '/',
  );

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
