// Nourma website shared interactions
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "×" : "☰";
  });
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }));
}

// Replace with Nourma's official WhatsApp number (Indonesia: 628xxxxxxxxxx).
const NOURMA_WHATSAPP_NUMBER = "628xxxxxxxxxx";
const waMessage = encodeURIComponent("Halo Nourma, saya ingin mengetahui informasi menu dan paket catering postpartum.");
const waUrl = /^628\d{8,13}$/.test(NOURMA_WHATSAPP_NUMBER) ? `https://wa.me/${NOURMA_WHATSAPP_NUMBER}?text=${waMessage}` : "#";
["whatsapp-link","ask-whatsapp","contact-whatsapp"].forEach(id => {
  const link = document.getElementById(id);
  if (!link) return;
  link.href = waUrl;
  if (waUrl === "#") link.addEventListener("click", event => {
    event.preventDefault();
    alert("WhatsApp Nourma belum dikonfigurasi. Tambahkan nomor resmi di js/script.js.");
  });
});
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Homepage slideshow
const slides = [...document.querySelectorAll(".hero-image-wrap .hero-image")];
const dots = [...document.querySelectorAll(".slide-dot")];
const prev = document.querySelector(".slide-prev"), next = document.querySelector(".slide-next");
const slideshow = document.querySelector(".hero-image-wrap");
let slideIndex = 0, slideTimer;
function showSlide(index) {
  if (!slides.length) return;
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide,i) => { slide.classList.toggle("is-active", i === slideIndex); slide.setAttribute("aria-hidden", String(i !== slideIndex)); });
  dots.forEach((dot,i) => { dot.classList.toggle("is-active", i === slideIndex); if(i === slideIndex) dot.setAttribute("aria-current","true"); else dot.removeAttribute("aria-current"); });
}
function stopSlides() { if (slideTimer) { clearInterval(slideTimer); slideTimer = null; } }
function startSlides() {
  stopSlides();
  if (slides.length > 1 && !document.hidden &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    slideTimer = setInterval(() => showSlide(slideIndex + 1), 5000);
  }
}
if(slides.length) {
  prev?.addEventListener("click", () => { showSlide(slideIndex-1); startSlides(); });
  next?.addEventListener("click", () => { showSlide(slideIndex+1); startSlides(); });
  dots.forEach((dot,i) => dot.addEventListener("click", () => { showSlide(i); startSlides(); }));
  slideshow?.addEventListener("mouseenter", stopSlides);
  document.addEventListener("visibilitychange", startSlides);
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", startSlides);
  slideshow?.addEventListener("mouseenter", stopSlides);
  slideshow?.addEventListener("mouseleave", startSlides);
  startSlides();
}

// Ask Nourma: lightweight scripted FAQ preview; full AI integration can be added later.
const askTrigger = document.querySelector(".ask-trigger");
const askPanel = document.querySelector(".ask-panel");
const askClose = document.querySelector(".ask-close");
if (askTrigger && askPanel) {
  askTrigger.addEventListener("click", () => {
    const open = askPanel.hidden;
    askPanel.hidden = !open;
    askTrigger.setAttribute("aria-expanded", String(open));
  });
  askClose?.addEventListener("click", () => { askPanel.hidden = true; askTrigger.setAttribute("aria-expanded","false"); });
  const answers = {
    menu: "Nourma menampilkan inspirasi hidangan sehat dan variatif. Menu final, bahan, dan informasi nutrisi perlu dikonfirmasi langsung.",
    packages: "Pilihan konsep paket Nourma meliputi Harian, Mingguan, dan Personal. Harga serta durasi akan diinformasikan oleh tim Nourma.",
    delivery: "Area layanan dan biaya pengiriman masih perlu dikonfirmasi. Silakan hubungi Nourma melalui WhatsApp."
  };
  document.querySelectorAll(".ask-option").forEach(button => button.addEventListener("click", () => {
    const answer = document.querySelector(".ask-answer");
    if(answer) answer.textContent = answers[button.dataset.chat] || "Silakan chat Nourma untuk informasi lebih lanjut.";
  }));
}


// Scroll reveal animation controller — graceful fallback if observer unsupported.
(function initNourmaScrollReveal() {
  try {
    const revealTargets = document.querySelectorAll(
      ".section-heading, .section-kicker, .about-text, .about-image, .benefit-card, .menu-card, .package-card, .gallery-grid > *, .contact-info, .contact-form"
    );
    revealTargets.forEach((element, index) => {
      if (!element.hasAttribute("data-animate")) {
        element.setAttribute("data-animate",
          element.matches(".about-image, .contact-form") ? "slide-right" :
          element.matches(".about-text") ? "slide-left" : "fade-up");
      }
      if (!element.hasAttribute("data-stagger") &&
          element.matches(".benefit-card, .menu-card, .package-card, .gallery-grid > *")) {
        element.setAttribute("data-stagger", String(Math.min(index % 8, 7)));
      }
    });

    const animated = document.querySelectorAll("[data-animate]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) {
      animated.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    // Keep observing so the reveal animation replays each time the element
    // enters the viewport (including scrolling back up).
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    animated.forEach((element) => observer.observe(element));
    // activate hidden CSS only once the observer setup is complete
    document.documentElement.classList.add("js-animations-ready");
  } catch (error) {
    document.documentElement.classList.remove("js-animations-ready");
    document.querySelectorAll("[data-animate]").forEach((element) => element.classList.add("is-visible"));
    console.error("Nourma scroll reveal initialization error:", error);
  }
})();


// ─── Privacy Policy Popup ────────────────────────────────────────────────────
(function initPrivacyPopup() {
  const STORAGE_KEY = 'nourma_privacy_accepted';

  // Don't show if user already responded
  if (localStorage.getItem(STORAGE_KEY)) return;

  const banner   = document.getElementById('privacy-banner');
  const modal    = document.getElementById('privacy-modal-backdrop');
  if (!banner) return;

  // Show banner after a short delay so it doesn't snap in immediately
  setTimeout(() => banner.classList.add('is-visible'), 800);

  function acceptPrivacy() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    banner.classList.add('is-hidden');
    banner.classList.remove('is-visible');
    closeModal();
  }

  function declinePrivacy() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    banner.classList.add('is-hidden');
    banner.classList.remove('is-visible');
    closeModal();
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.querySelector('.privacy-modal')?.setAttribute('tabindex', '-1');
    modal.querySelector('.privacy-modal')?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Banner buttons
  document.getElementById('privacy-accept')?.addEventListener('click', acceptPrivacy);
  document.getElementById('privacy-decline')?.addEventListener('click', declinePrivacy);
  document.getElementById('privacy-learn-more')?.addEventListener('click', openModal);

  // Modal buttons
  document.getElementById('privacy-modal-accept')?.addEventListener('click', acceptPrivacy);
  document.getElementById('privacy-modal-decline')?.addEventListener('click', declinePrivacy);
  document.getElementById('privacy-modal-close')?.addEventListener('click', closeModal);

  // Close modal on backdrop click
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
  });
})();
