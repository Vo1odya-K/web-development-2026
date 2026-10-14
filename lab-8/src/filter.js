/** @typedef {import('./normalize.js').Show} Show */

/**
 * @typedef {object} FilterOptions
 * @property {string | null} [query] частина назви
 * @property {string | null} [genre] жанр
 * @property {number | null} [minRating] мінімальна оцінка
 */

/**
 * C2. Повертає серіали, які відповідають усім заданим фільтрам.
 * Специфікація — ТЗ, C2.
 *
 * @param {Show[]} shows
 * @param {FilterOptions} [options]
 * @returns {Show[]}
 */
export function filterShows(shows, options = {}) {
  if (!Array.isArray(shows)) return [];

  const { query, genre, minRating } = options && typeof options === 'object' ? options : {};

  const cleanQuery =
    typeof query === 'string' && query.trim() !== '' ? query.trim().toLowerCase() : null;

  const cleanGenre = typeof genre === 'string' && genre.trim() !== '' ? genre.trim() : null;

  const hasMinRating = typeof minRating === 'number' && !Number.isNaN(minRating) && minRating > 0;

  return shows.filter((show) => {
    if (cleanQuery !== null) {
      const showName = (show.name || '').toLowerCase();
      if (!showName.includes(cleanQuery)) {
        return false;
      }
    }

    if (cleanGenre !== null) {
      if (!Array.isArray(show.genres) || !show.genres.includes(cleanGenre)) {
        return false;
      }
    }

    if (hasMinRating) {
      if (show.rating === null || show.rating === undefined || show.rating < minRating) {
        return false;
      }
    }

    return true;
  });
}
