document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
  });
});