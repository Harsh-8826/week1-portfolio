/* ==========================================================================
   navigation.js — header behavior: mobile menu, sticky shadow, scroll
   progress bar, back-to-top button, active link highlighting, theme toggle
   ========================================================================== */

(function () {
  /* ---------------- Mobile menu ---------------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');

  function closeMenu() {
    if (!navLinks || !burger) return;
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    navLinks.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
  }

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  /* ---------------- Scroll progress bar ---------------- */
  const progressBar = document.getElementById('scroll-progress');

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
  }

  /* ---------------- Sticky header shadow ---------------- */
  const header = document.getElementById('site-header');

  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  /* ---------------- Back to top button ---------------- */
  const backToTop = document.getElementById('back-to-top');

  function updateBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinkEls.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ---------------- Combined scroll handler ---------------- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        updateHeaderState();
        updateBackToTop();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateProgress();
  updateHeaderState();
  updateBackToTop();
  updateActiveLink();

  /* ---------------- Theme toggle (dark / light) ---------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function getStoredTheme() {
    try {
      return window.localStorage.getItem('hps-theme');
    } catch (err) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem('hps-theme', theme);
    } catch (err) {
      /* localStorage unavailable (e.g. sandboxed preview) — theme just won't persist */
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }

  const storedTheme = getStoredTheme();
  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      applyTheme(nextTheme);
      storeTheme(nextTheme);
    });
  }
})();
