import { getShow } from './state.js';

/**
 * C4. Відкриває діалог #details для серіалу: назва, опис, посилання на сторінку TVmaze і форма
 * з моєю оцінкою й нотаткою. Специфікація — ТЗ, C4.
 *
 * @param {number} id
 */
export function openDetails(id) {
  const show = getShow(id);
  const dialog = document.querySelector('#details');
  const title = document.querySelector('#details-title');
  const summary = document.querySelector('#details-summary');
  const link = document.querySelector('#details-link');

  if (!(dialog instanceof HTMLDialogElement)) throw new TypeError('Не знайдено діалог #details');
  if (!(title instanceof HTMLElement)) throw new TypeError('Не знайдено заголовок #details-title');
  if (!(summary instanceof HTMLElement)) throw new TypeError('Не знайдено опис #details-summary');
  if (!(link instanceof HTMLAnchorElement)) throw new TypeError('Не знайдено посилання #details-link');

  title.textContent = show.name;
  link.href = show.url;

  const parsedSummary = new DOMParser().parseFromString(show.summary, 'text/html');
  const paragraphs = [...parsedSummary.body.querySelectorAll('p')].map((paragraph) => paragraph.textContent ?? '');
  const text = paragraphs.length ? paragraphs : [parsedSummary.body.textContent ?? ''];
  summary.replaceChildren(
    ...text.map((paragraph) => {
      const element = document.createElement('p');
      element.textContent = paragraph;
      return element;
    }),
  );

  if (!dialog.open) dialog.showModal();
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  // TODO C4
}
