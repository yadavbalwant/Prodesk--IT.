/* ============================================================
   Prodesk IT — Landing Page JavaScript
   Navbar toggle · Dark mode · Scroll reveal · Count-up stats
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. Dark Mode (with localStorage persistence)
     ───────────────────────────────────────────── */
  const STORAGE_KEY = 'prodesk-theme';
  const root = document.documentElement;

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setStoredTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* no-op */ }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }

  // Initialize: stored > system preference > light
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  }

  const themeToggles = document.querySelectorAll('#themeToggle, #themeToggleMobile');
  themeToggles.forEach(function (btn) {
    btn.addEventListener('click', toggleTheme);
  });

  /* ─────────────────────────────────────────────
     2. Navbar scroll state
     ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─────────────────────────────────────────────
     3. Mobile hamburger menu
     ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    hamburger.classList.remove('navbar__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('navbar__mobile-menu--open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    hamburger.classList.add('navbar__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('navbar__mobile-menu--open');
    document.body.style.overflow = 'hidden';
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('navbar__mobile-menu--open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) closeMenu();
  });

  // Close menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ─────────────────────────────────────────────
     4. Scroll Reveal (IntersectionObserver)
     ───────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ─────────────────────────────────────────────
     5. Count-Up Stats
     ───────────────────────────────────────────── */
  function animateCountUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  const statValues = document.querySelectorAll('.stats__value');

  if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCountUp(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statValues.forEach(function (el) {
      statObserver.observe(el);
    });
  } else {
    statValues.forEach(function (el) {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
    });
  }

  /* ─────────────────────────────────────────────
     6. Smooth scroll for anchor links
     ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
