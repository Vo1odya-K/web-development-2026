import { getShow, notes, saveNote } from './state.js';

/** @type {HTMLButtonElement | null} */
let opener = null;

/** @type {number | null} */
let activeShowId = null;

function clearRatingError() {
  const rating = document.querySelector('#note-rating');
  const error = document.querySelector('#note-rating-error');
  if (!(rating instanceof HTMLInputElement) || !(error instanceof HTMLElement)) {
    throw new TypeError('Не знайдено поле оцінки або текст її помилки');
  }

  rating.removeAttribute('aria-invalid');
  const describedBy = (rating.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter((id) => id && id !== error.id);
  if (describedBy.length) rating.setAttribute('aria-describedby', describedBy.join(' '));
  else rating.removeAttribute('aria-describedby');
  error.textContent = '';
}

/**
 * @param {string} message
 */
function showRatingError(message) {
  const rating = document.querySelector('#note-rating');
  const error = document.querySelector('#note-rating-error');
  if (!(rating instanceof HTMLInputElement) || !(error instanceof HTMLElement)) {
    throw new TypeError('Не знайдено поле оцінки або текст її помилки');
  }

  error.textContent = message;
  rating.setAttribute('aria-invalid', 'true');
  const describedBy = new Set(
    (rating.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean),
  );
  describedBy.add(error.id);
  rating.setAttribute('aria-describedby', [...describedBy].join(' '));
}

function returnFocus() {
  if (opener?.isConnected) {
    opener.focus();
    return;
  }

  const heading = document.querySelector('#results-heading');
  if (heading instanceof HTMLElement) {
    heading.tabIndex = -1;
    heading.focus();
  }
}

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
  const rating = document.querySelector('#note-rating');
  const noteText = document.querySelector('#note-text');

  if (!(dialog instanceof HTMLDialogElement)) throw new TypeError('Не знайдено діалог #details');
  if (!(title instanceof HTMLElement)) throw new TypeError('Не знайдено заголовок #details-title');
  if (!(summary instanceof HTMLElement)) throw new TypeError('Не знайдено опис #details-summary');
  if (!(link instanceof HTMLAnchorElement))
    throw new TypeError('Не знайдено посилання #details-link');
  if (!(rating instanceof HTMLInputElement)) throw new TypeError('Не знайдено поле #note-rating');
  if (!(noteText instanceof HTMLTextAreaElement))
    throw new TypeError('Не знайдено поле #note-text');

  const activeElement = document.activeElement;
  if (
    activeElement instanceof HTMLButtonElement &&
    activeElement.matches('[data-action="details"]')
  ) {
    opener = activeElement;
  }
  activeShowId = show.id;
  title.textContent = show.name;
  link.href = show.url;

  const parsedSummary = new DOMParser().parseFromString(show.summary, 'text/html');
  const paragraphs = [...parsedSummary.body.querySelectorAll('p')].map(
    (paragraph) => paragraph.textContent ?? '',
  );
  const text = paragraphs.length ? paragraphs : [parsedSummary.body.textContent ?? ''];
  summary.replaceChildren(
    ...text.map((paragraph) => {
      const element = document.createElement('p');
      element.textContent = paragraph;
      return element;
    }),
  );

  clearRatingError();
  const note = notes.get(show.id);
  rating.value = note ? String(note.rating) : '';
  noteText.value = note?.text ?? '';

  if (!dialog.open) {
    dialog.showModal();
    title.tabIndex = -1;
    title.focus();
  }
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  const dialog = document.querySelector('#details');
  const form = document.querySelector('#note-form');
  const rating = document.querySelector('#note-rating');
  const noteText = document.querySelector('#note-text');
  const cancel = form?.querySelector('button[type="button"]');
  const status = document.querySelector('#status');

  if (!(dialog instanceof HTMLDialogElement)) throw new TypeError('Не знайдено діалог #details');
  if (!(form instanceof HTMLFormElement)) throw new TypeError('Не знайдено форму #note-form');
  if (!(rating instanceof HTMLInputElement)) throw new TypeError('Не знайдено поле #note-rating');
  if (!(noteText instanceof HTMLTextAreaElement))
    throw new TypeError('Не знайдено поле #note-text');
  if (!(cancel instanceof HTMLButtonElement)) throw new TypeError('Не знайдено кнопку «Скасувати»');
  if (!(status instanceof HTMLElement)) throw new TypeError('Не знайдено елемент #status');

  form.noValidate = true;

  rating.addEventListener('input', () => {
    const value = rating.valueAsNumber;
    if (rating.value !== '' && Number.isInteger(value) && value >= 1 && value <= 10) {
      clearRatingError();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = rating.valueAsNumber;
    if (!rating.value || !Number.isInteger(value) || value < 1 || value > 10) {
      showRatingError('Введіть ціле число від 1 до 10.');
      rating.focus();
      return;
    }
    if (activeShowId === null) throw new TypeError('Не вибрано серіал для збереження нотатки');

    const show = getShow(activeShowId);
    saveNote(show.id, { rating: value, text: noteText.value });
    dialog.close();
    refresh();
    status.textContent = `Нотатку до ${show.name} збережено`;

    const detailsButton = document.querySelector(
      `#results li[data-id="${show.id}"] button[data-action="details"]`,
    );
    if (detailsButton instanceof HTMLButtonElement) detailsButton.focus();
    else returnFocus();
  });

  cancel.addEventListener('click', () => {
    dialog.close();
    returnFocus();
  });

  dialog.addEventListener('close', returnFocus);
}
