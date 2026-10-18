/** @typedef {import('./state.js').Show} Show */
import { notes, shows, watchlist } from './state.js';

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
export function renderShows(list) {
  const results = document.querySelector('#results');
  const status = document.querySelector('#status');
  const template = document.querySelector('#show-card');

  if (!(results instanceof HTMLUListElement))
    throw new TypeError('Елемент #results має бути списком <ul>');
  if (!(status instanceof HTMLElement)) throw new TypeError('Не знайдено елемент #status');
  if (!(template instanceof HTMLTemplateElement))
    throw new TypeError('Не знайдено шаблон #show-card');

  const cards = list.map((show) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.card');
    if (!(card instanceof HTMLLIElement))
      throw new TypeError('У шаблоні #show-card має бути картка <li>');

    card.dataset.id = String(show.id);
    card.querySelectorAll('[data-field="name"]').forEach((field) => {
      field.textContent = show.name;
    });

    const year = card.querySelector('[data-field="year"]');
    const genres = card.querySelector('[data-field="genres"]');
    const rating = card.querySelector('[data-field="rating"]');
    if (
      !(year instanceof HTMLElement) ||
      !(genres instanceof HTMLElement) ||
      !(rating instanceof HTMLElement)
    ) {
      throw new TypeError('У шаблоні #show-card відсутнє поле року, жанрів або оцінки');
    }

    year.textContent = show.year === null ? '—' : String(show.year);
    genres.textContent = show.genres.length ? show.genres.join(', ') : '—';
    rating.textContent = show.rating === null ? '—' : String(show.rating);

    const toggle = card.querySelector('[data-action="toggle"]');
    if (!(toggle instanceof HTMLButtonElement))
      throw new TypeError('У шаблоні #show-card немає кнопки «До списку»');
    toggle.setAttribute('aria-pressed', String(watchlist.has(show.id)));

    const note = notes.get(show.id);
    const mine = card.querySelector('.card__mine');
    const myRating = card.querySelector('[data-field="my-rating"]');
    const noteText = card.querySelector('[data-field="note"]');
    if (
      !(mine instanceof HTMLElement) ||
      !(myRating instanceof HTMLElement) ||
      !(noteText instanceof HTMLElement)
    ) {
      throw new TypeError('У шаблоні #show-card відсутнє поле моєї оцінки або нотатки');
    }
    mine.hidden = !note;
    noteText.hidden = !note?.text;
    if (note) {
      myRating.textContent = String(note.rating);
      noteText.textContent = note.text;
    }

    return fragment;
  });

  results.replaceChildren(...cards);
  status.textContent = list.length
    ? `Знайдено: ${list.length} з ${shows.length}`
    : 'Нічого не знайдено';
}
