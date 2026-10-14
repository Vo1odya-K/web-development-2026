/** @typedef {import('./normalize.js').Show} Show */

/**
 * C3. Повертає новий масив серіалів, відсортований за полем `key`.
 * Специфікація — ТЗ, C3.
 *
 * @param {Show[]} shows
 * @param {'name' | 'year' | 'rating'} key
 * @param {'asc' | 'desc'} [direction]
 * @returns {Show[]}
 */
export function sortShows(shows, key, direction = 'asc') {
  if (!Array.isArray(shows)) return [];

  const result = [...shows];
  const isAsc = direction === 'asc';

  result.sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    const isANull = valA === null || valA === undefined;
    const isBNull = valB === null || valB === undefined;

    if (isANull && isBNull) return 0;
    if (isANull) return 1;
    if (isBNull) return -1;

    let comparison = 0;

    if (key === 'name') {
      comparison = String(valA).localeCompare(String(valB), undefined, { sensitivity: 'base' });
    } else {
      comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
    }

    return isAsc ? comparison : -comparison;
  });

  return result;
}
