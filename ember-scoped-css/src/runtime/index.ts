/**
 * Appends a suffix to a class name during build time.
 * This function is not available at runtime and is removed.
 *
 * @param {string} className the class, defined within the co-located CSS to have a suffix appended to it during build time.
 */
export function scopedClass(className: string): string {
  throw new Error(
    `scopedClass is not available at runtime. Cannot do anything with ${className}`,
  );
}
