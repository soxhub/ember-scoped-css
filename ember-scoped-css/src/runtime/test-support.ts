import {generateRelativePathHash as generateHash } from '../lib/generateRelativePathHash.js';
import {renameClass} from '../lib/renameClass.js';

/**
 * On element selectors where there are no classes,
 * you may pass only the modulePath and get the hash for the element.
 *
 * For example, in app code,
 *  with template code `<h3>x</h3>`
 *  and css `h3 { }`
 *  a class will be added during the build, result in:
 *    the template: `<h3 class="some-hash">x</h3>`
 *    and css `h3.some-hash { }`
 *
 * @example
 * If a file is located at `app/components/foo/bar.hbs`
 * The associated css should be at `app/components/foo/bar.css`
 * and the path passed to `scopedClass` should be `<modulePrefix>/components/foo/bar`
 *
 * @example
 * If a file is located at `app/templates/bar.hbs`
 * The associated css should be at `app/templates/bar.css`
 * and the path passed to `scopedClass` should be `<modulePrefix>/templates/bar`
 *
 * @example
 * If a file is located at `<podModulePrefix>/bar/template.hbs`
 * The associated css should be at `app/<podModulePrefix sub path>/bar/styles.css`
 * and the path passed to `scopedClass` should be `<podModulePrefix>/bar`
 *
 */
export function scopedClass(modulePath: string): string;

/**
 * Retrieve the built hash for a class.
 *
 * For example, in app code,
 *  with template code `<h3 class="foo">x</h3>`
 *  and css `.foo { }`
 *  a hash will be added during the build, resulting in:
 *    the template: `<h3 class="foo_some-hash">x</h3>`
 *    and css `.foo_some-hash { }`
 *
 * @example
 * If a file is located at `app/components/foo/bar.hbs`
 * The associated css should be at `app/components/foo/bar.css`
 * and the path passed to `scopedClass` should be `<modulePrefix>/components/foo/bar`
 *
 * @example
 * If a file is located at `app/templates/bar.hbs`
 * The associated css should be at `app/templates/bar.css`
 * and the path passed to `scopedClass` should be `<modulePrefix>/templates/bar`
 *
 * @example
 * If a file is located at `<podModulePrefix>/bar/template.hbs`
 * The associated css should be at `app/<podModulePrefix sub path>/bar/styles.css`
 * and the path passed to `scopedClass` should be `<podModulePrefix>/bar`
 *
 */
export function scopedClass(className: string, modulePath: string): string;

export function scopedClass(
  ...args: [modulepath: string] | [className: string, modulePath: string]
) {
  if (args.length === 1) {
    return generateHash(args[0]);
  }

  let [className, modulePath] = args;

  const hash = generateHash(modulePath);

  return renameClass(className, hash);
}
