/**
 * Nourma Catering – Main JavaScript
 *
 * Sections:
 * 1. Mobile Navigation Toggle
 * 2. Sticky Header Shadow
 * 3. Smooth Scroll (fallback for older browsers)
 * 4. Active Navigation Highlight on Scroll
 * 5. Contact Form Handler (placeholder)
 */

/* ============================================================
   Helpers
   ============================================================ */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/* ============================================================
   1. Mobile Navigation Toggle
   ============================================================ */
function initMobileNav() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  $$('a', navLinks).forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   2. Sticky Header Shadow
   ============================================================ */
function initHeaderScroll() {
  const header = $('#header');
  if (!header) return;

  const SHADOW_CLASS = 'header--scrolled';

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add(SHADOW_CLASS);
    } else {
      header.classList.remove(SHADOW_CLASS);
    }
  }, { passive: true });
}

/* ============================================================
   3. Smooth Scroll (fallback)
   ============================================================ */
function initSmoothScroll() {
  // Modern browsers handle this via CSS `scroll-behavior: smooth`.
  // This provides a fallback for browsers that don't support it.
  if ('scrollBehavior' in document.documentElement.style) return;

  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   4. Active Navigation Highlight on Scroll
   ============================================================ */
function initScrollSpy() {
  const sections   = $$('main section[id]');
  const navLinks   = $$('#nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              'nav-link--active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   5. Contact Form Handler (placeholder)
   ============================================================ */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // TODO: Replace with actual API call or WhatsApp redirect in future development.
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const event = form.event.value;
    const message = form.message.value.trim();

    const whatsappNumber = '628XXXXXXXXXX'; // TODO: replace with real number
    const text = encodeURIComponent(
      `Halo Nourma Catering,\n\nNama: ${name}\nNomor: ${phone}\nJenis Acara: ${event}\nPesan: ${message}`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  });
}

/* ============================================================
   Init – run after DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initSmoothScroll();
  initScrollSpy();
  initContactForm();
});
