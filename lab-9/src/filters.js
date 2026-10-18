/** @typedef {import('./state.js').Filters} Filters */

/**
 * C3. Повертає поточні значення форми фільтрів #filters. Специфікація — ТЗ, C3.
 *
 * @returns {Filters}
 */
export function readFilters() {
  const query = document.querySelector('#filter-query');
  const genre = document.querySelector('#filter-genre');
  const mine = document.querySelector('#filter-mine');
  if (!(query instanceof HTMLInputElement)) throw new TypeError('Не знайдено поле #filter-query');
  if (!(genre instanceof HTMLSelectElement)) throw new TypeError('Не знайдено поле #filter-genre');
  if (!(mine instanceof HTMLInputElement)) throw new TypeError('Не знайдено поле #filter-mine');

  return { query: query.value, genre: genre.value, mine: mine.checked };
}

/**
 * C3. Підключає форму фільтрів: після введення, зміни чи скидання — refresh(), а submit не
 * перезавантажує сторінку. main.js викликає цю функцію один раз. Специфікація — ТЗ, C3.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initFilters(refresh) {
  const form = document.querySelector('#filters');
  if (!(form instanceof HTMLFormElement)) throw new TypeError('Не знайдено форму #filters');

  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);
  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('reset', () => queueMicrotask(refresh));
}
