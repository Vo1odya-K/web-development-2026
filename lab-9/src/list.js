import { openDetails } from './details.js';
import { toggle, watchlist } from './state.js';

/**
 * C2. Підключає кнопки карток у списку #results: «До списку» додає серіал до мого списку або
 * прибирає з нього, «Детальніше» відкриває діалог (openDetails з details.js). main.js викликає
 * цю функцію один раз, після першого показу списку. Специфікація — ТЗ, C2.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initList(refresh) {
  const results = document.querySelector('#results');
  const count = document.querySelector('#watchlist-count');
  if (!(results instanceof HTMLUListElement)) throw new TypeError('Елемент #results має бути списком <ul>');
  if (!(count instanceof HTMLElement)) throw new TypeError('Не знайдено елемент #watchlist-count');

  results.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('button[data-action]');
    if (!(button instanceof HTMLButtonElement) || !results.contains(button)) return;

    const card = button.closest('li[data-id]');
    if (!(card instanceof HTMLLIElement)) return;
    const id = Number(card.dataset.id);

    if (button.dataset.action === 'details') {
      openDetails(id);
      return;
    }
    if (button.dataset.action !== 'toggle') return;

    const cards = [...results.querySelectorAll('li[data-id]')];
    const previousIndex = cards.indexOf(card);
    toggle(id);
    count.textContent = String(watchlist.size);
    refresh();

    const focusTarget = results.querySelector(
      `li[data-id="${id}"] button[data-action="toggle"]`,
    );
    if (focusTarget instanceof HTMLButtonElement) {
      focusTarget.focus();
      return;
    }

    const fallback = results.querySelectorAll('li[data-id]')[previousIndex]
      ?? results.querySelectorAll('li[data-id]')[previousIndex - 1];
    const fallbackButton = fallback?.querySelector('button[data-action="toggle"]');
    if (fallbackButton instanceof HTMLButtonElement) {
      fallbackButton.focus();
      return;
    }

    const heading = document.querySelector('#results-heading');
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1;
      heading.focus();
    }
  });
}
