import path from 'node:path';

import { findWorkspacePath } from './generateAbsolutePathHash';

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

  /**
   * Routes' Pods support
   *
   * components + pods will never be supported.
   */
  let isPod =
    !fileName.includes('/components/') && fileName.endsWith('template.js');

  if (isPod) {
    cssPath = fileName.replace(/template\.js$/, 'styles.css');
  }

  return cssPath;
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
