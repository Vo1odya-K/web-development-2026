/**
 * @typedef {object} RawShow Запис із `data/shows.json` у форматі TVmaze.
 * @property {number} id
 * @property {string} name
 * @property {string[]} [genres]
 * @property {number | null} [runtime] тривалість серії, хв
 * @property {string | null} [premiered] дата прем'єри, "YYYY-MM-DD"
 * @property {{ average: number | null } | null} [rating]
 * @property {{ id: number, name: string } | null} [network]
 */

/**
 * @typedef {object} Show Серіал після normalizeShow() — з таким форматом працюють C2–C4.
 * @property {number} id
 * @property {string} name
 * @property {number | null} year рік прем'єри
 * @property {number | null} rating середня оцінка глядачів
 * @property {number | null} runtime тривалість серії, хв
 * @property {string | null} network назва телемережі
 * @property {string[]} genres
 */

/**
 * C1. Перетворює запис TVmaze на {@link Show}.
 * Специфікація — ТЗ, C1.
 *
 * @param {RawShow} raw
 * @returns {Show}
 */
export function normalizeShow(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const { id, name = '', genres = [], rating, premiered, runtime = null, network } = raw;

  let avgRating = null;
  if (rating && typeof rating === 'object' && 'average' in rating && rating.average !== null) {
    avgRating = rating.average;
  }

  let year = null;
  if (premiered && typeof premiered === 'string') {
    const parsedYear = parseInt(premiered.slice(0, 4), 10);
    if (!Number.isNaN(parsedYear)) {
      year = parsedYear;
    }
  }

  let networkName = null;
  if (network && typeof network === 'object' && 'name' in network) {
    networkName = network.name ?? null;
  }

  return {
    id,
    name: name ?? '',
    year,
    rating: avgRating,
    runtime: runtime ?? null,
    network: networkName,
    genres: Array.isArray(genres) ? [...genres] : [],
  };
}
