import { hash } from './hash-from-module-path.js';
import { appPath } from './utils.js';

export { hash } from './hash-from-module-path.js';

export function hashFromAbsolutePath(absolutePath) {
  /**
   * The whole of `appPath` ultimately transforms the `absolutePath`
   * into the exact string that folks will pass to `relativePath`
   * at runtime.
   */
  const modulePath = appPath(absolutePath);

  // eslint-disable-next-line no-console
  console.log(modulePath);

  const postfix = hash(modulePath);

  return postfix;
}
