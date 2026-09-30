const menuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const desktopViewport = window.matchMedia('(min-width: 1024px)');

if (menuButton && mobileMenu) {
  const setMenuOpen = (isOpen) => {
    const shouldOpen = isOpen && !desktopViewport.matches;
    mobileMenu.hidden = !shouldOpen;
    menuButton.setAttribute('aria-expanded', String(shouldOpen));
  };

  setMenuOpen(!mobileMenu.hidden);

  menuButton.addEventListener('click', () => {
    setMenuOpen(mobileMenu.hidden);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  const closeMenuOnDesktop = () => {
    if (desktopViewport.matches) {
      setMenuOpen(false);
    }
  };

  desktopViewport.addEventListener('change', closeMenuOnDesktop);
  window.addEventListener('resize', closeMenuOnDesktop);
}
