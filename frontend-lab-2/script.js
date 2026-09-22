// Інтерактивність для кнопок вибору тарифу
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const card = event.target.closest('.card');
      const planName = card.querySelector('.card-title').textContent;

      alert(`Дякуємо за вибір тарифу "${planName}"!`);
    });
  });
});
