/**
 * Combines multiple class names into a single string.
 * Filters out any falsy values (e.g., `null`, `undefined`, `false`, `0`, `NaN`, or an empty string).
 *
 * @param {...unknown[]} classes - An array of class names that may include falsy values.
 * @returns {string} - A single string of class names separated by spaces.
 *
 * @example
 * // Returns 'btn btn-primary'
 * classNames('btn', 'btn-primary', false, null, undefined);
 */
export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}
