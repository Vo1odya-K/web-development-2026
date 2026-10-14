/** @typedef {import('./normalize.js').Show} Show */

/**
 * @typedef {object} GenreStats
 * @property {number} count скільки серіалів мають цей жанр
 * @property {number | null} averageRating середня оцінка цих серіалів
 */

/**
 * C4. Рахує статистику для кожного жанру.
 * Специфікація — ТЗ, C4.
 *
 * @param {Show[]} shows
 * @returns {Record<string, GenreStats>} ключ — назва жанру
 */
export function genreStats(shows) {
  if (!Array.isArray(shows)) return {};

  const stats = {};

  for (const show of shows) {
    if (!Array.isArray(show.genres)) continue;

    for (const genre of show.genres) {
      if (!stats[genre]) {
        stats[genre] = {
          count: 0,
          totalRating: 0,
          ratingCount: 0,
        };
      }

      stats[genre].count += 1;

      if (show.rating !== null && show.rating !== undefined && typeof show.rating === 'number') {
        stats[genre].totalRating += show.rating;
        stats[genre].ratingCount += 1;
      }
    }
  }

  const result = {};

  for (const [genre, data] of Object.entries(stats)) {
    let averageRating = null;
    if (data.ratingCount > 0) {
      averageRating = Number((data.totalRating / data.ratingCount).toFixed(1));
    }

    result[genre] = {
      count: data.count,
      averageRating,
    };
  }

  return result;
}
