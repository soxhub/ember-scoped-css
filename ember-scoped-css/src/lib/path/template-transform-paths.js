import path from 'node:path';

import { findWorkspacePath, moduleName as projectName } from './utils.js';

/**
 * template plugins do not hand us the correct file path.
 * additionally, we may not be able to rely on this data in the future,
 * so this functions acts as a means of normalizing _whatever_ we're given
 * in the future.
 *
 * @param {string} filename
 * @returns {string} the absolute path to the file
 */
export function fixFilename(filename) {
  let fileName = filename;
  let workspace = findWorkspacePath(fileName);
  let moduleName = projectName(workspace);

  /**
   * For a simple case, there are sometimes duplicate module paths in the fileName
   * let's collapse that and
   */
  let wrongModuleName = path.basename(workspace);
  let deduped = fileName.replace(
    `${wrongModuleName}/${moduleName}/`,
    `${wrongModuleName}/app/`,
  );

  if (deduped !== fileName) {
    return deduped;
  }

  /**
   * ember-source 5.8:
   * - the filename looks like an absolute path, but swapped out the 'app' part of the path
   *   with the module name, so the file paths never exist on disk
   */
  if (
    !fileName.includes(path.join(workspace, 'app')) &&
    !fileName.includes('/node_modules/.embroider/')
  ) {
    let maybeModule = fileName.replace(workspace, '');
    let [maybeScope, ...rest] = maybeModule.split('/').filter(Boolean);
    let parts = rest;

    if (maybeScope.startsWith('@')) {
      let [, ...rester] = rest;

      parts = rester;
    }

    let relative = path.join(...parts);

    /**
     * We don't actually know if this file is an app.
     * it could be an addon (v1 or v2)
     *
     * So here we log to see if we have unhandled situations.
     */
    let candidatePath = path.join(workspace, 'app', relative);

    return candidatePath;
  }

  /**
   * under embroider@3, the fileName will be the path to the rewritten file.
   * we don't want this.
   * we want the path to the original source.
   * Through the powers of ✨ convention ✨, we can map back to source.
   */
  if (fileName.includes('/node_modules/.embroider/rewritten-app/')) {
    let candidatePath = fileName.replace(
      '/node_modules/.embroider/rewritten-app/',
      '/app/',
    );

    return candidatePath;
  }

  // TODO: why are we passed files to other projects?
  if (!fileName.includes(workspace)) {
    return fileName;
  }

  // Fallback to what the plugin system gives us.
  // This may be wrong, and if wrong, reveals
  // unhandled scenarios with the file names in the plugin infra
  return fileName;
}
