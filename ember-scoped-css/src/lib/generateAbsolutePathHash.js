import generateHash from './generateRelativePathHash.js';
import path from 'path';
import { findUpSync } from 'find-up';
import fsSync from 'node:fs';


export default function (cssFileName) {
  const modulePath = appPath(cssFileName);
  return generateHash(modulePath);
}


/**
  * returns the app-module path of the source file
  *
  * This assumes normal ember app conventions
  *
  * which is `<package.json#name>/path-to-file`
  */
function appPath(sourcePath) {
  let workspacePath = findWorkspacePath(sourcePath);
  let name = workspacePackageName(sourcePath);

  /**
   *  Under embroider builds, the spec-compliant version of the app
   * has all the files under a folder which represents the package name,
   * rather than "app".
   */
  let packageRelative = sourcePath.replace(workspacePath, '');

  return `${name}${packageRelative}`;
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

  const packageJsonPath = findUpSync('package.json', {
    cwd: path.dirname(sourcePath)
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
