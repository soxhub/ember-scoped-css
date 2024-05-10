/**
 * @typedef {import('@glimmer/syntax').ASTPlugin} ASTPlugin
 * @typedef {import('@glimmer/syntax').ASTPluginEnvironment} ASTPluginEnvironment
 *
 */
import path from 'node:path';

import { existsSync } from 'fs';

import { getCSSInfo } from '../lib/css/utils.js';
import { appPath, findWorkspacePath } from '../lib/generateAbsolutePathHash.js';
import { generateRelativePathHash } from '../lib/generateRelativePathHash.js';
import {
  cssPathFor,
  isRelevantFile,
  withoutExtension,
} from '../lib/path-utils.js';
import { templatePlugin } from '../lib/rewriteHbs.js';

const noopPlugin = {
  name: 'ember-scoped-css:noop',
  visitor: {},
};

/**
 * @returns {ASTPlugin}
 */
export function createPlugin(config) {
  /**
   *
   * @param {ASTPluginEnvironment} env
   */
  return function scopedCss(env) {
    let isRelevant = isRelevantFile(env.filename, config.additionalRoots);

    if (!isRelevant) {
      return noopPlugin;
    }

    let absolutePath = fixFilename(env);
    let modulePath = appPath(absolutePath);

    let cssPath = cssPathFor(absolutePath);
    let info = getCSSInfo(cssPath);
    let postfix = generateRelativePathHash(modulePath);

    if (!info) {
      return noopPlugin;
    }

    let visitors = templatePlugin({
      classes: info.classes,
      tags: info.tags,
      postfix,
    });

    return {
      name: 'ember-scoped-css:template-plugin',
      visitor: {
        // Stack Manager
        ...visitors,
        // Visitors broken out like this so we can conditionally
        // debug based on file path.
        AttrNode(...args) {
          return visitors.AttrNode(...args);
        },
        ElementNode(...args) {
          return visitors.ElementNode(...args);
        },
        MustacheStatement(...args) {
          return visitors.MustacheStatement(...args);
        },
        SubExpression(...args) {
          return visitors.SubExpression(...args);
        },
      },
    };
  };
}

/**
 * template plugins do not hand us the correct file path.
 * additionally, we may not be able to rely on this data in the future,
 * so this functions acts as a means of normalizing _whatever_ we're given
 * in the future.
 *
 * @param {ASTPluginEnvironment} env
 * @returns {string} the absolute path to the file
 */
function fixFilename(env) {
  let fileName = env.filename;
  let workspace = findWorkspacePath(fileName);

  /**
   * ember-source 5.8:
   * - the filename looks like an absolute path, but swapped out the 'app' part of the path
   *   with the module name, so the file paths never exist on disk
   */
  if (!fileName.includes('/app/')) {
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

    let resolved = findCandidate(candidatePath);

    if (resolved) {
      return resolved;
    }
  }

  console.debug(`[ScopedCSS]: Failed to handle ${fileName}`);

  // Fallback to what the plugin system gives us.
  // This may be wrong, and if wrong, reveals
  // unhandled scenarios with the file names in the plugin infra
  return fileName;
}

const COMPILES_TO_JS = ['.hbs', '.gjs', '.gts'];

function findCandidate(filePath) {
  if (existsSync(filePath)) {
    return filePath;
  }

  let withoutExt = withoutExtension(filePath);

  for (let ext of COMPILES_TO_JS) {
    let candidatePath = withoutExt + ext;

    if (existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  return null;
}
