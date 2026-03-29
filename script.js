/* ===========================
   STACKING CARDS SCROLL EFFECT
   ===========================
   Each card is position:sticky. As you scroll, cards stick at their
   top offset. When the next card scrolls up and covers the previous,
   the covered card scales down, dims slightly, and gains extra
   border-radius — creating a beautiful stacked-deck effect.
   =========================== */
(function () {
  const stackCards = document.querySelectorAll('.stack-card');
  const NUM_CARDS = stackCards.length;

  // Must match CSS values for .stack-card[data-index="N"] { top: ... }
  const STICKY_TOPS = [80, 110, 140, 170];

  // Animation tuning
  const SCALE_STEP = 0.035;
  const DIM_STEP = 0.06;
  const EXTRA_RADIUS = 6;
  const COVER_DISTANCE = 350;  // px of scroll for a card to be "fully covered"

  function handleStackScroll() {
    stackCards.forEach((card, i) => {
      const inner = card.querySelector('.stack-card-inner');
      const rect = card.getBoundingClientRect();
      const stickyTop = STICKY_TOPS[i] || STICKY_TOPS[STICKY_TOPS.length - 1];

      // How far the card's top has been pushed above its sticky point
      const scrolledPast = stickyTop - rect.top;

      if (scrolledPast > 0) {
        // The card is currently stuck — and is being (or about to be) covered
        const progress = Math.min(scrolledPast / COVER_DISTANCE, 1);
        const cardsAbove = NUM_CARDS - 1 - i; // how many cards will pile on top

        if (cardsAbove <= 0) {
          // Last card — never scale down
          inner.style.transform = '';
          inner.style.opacity = '';
          inner.style.borderRadius = '';
          return;
        }

        const scale = 1 - progress * SCALE_STEP * cardsAbove;
        const opacity = 1 - progress * DIM_STEP * cardsAbove;
        const radius = 24 + progress * EXTRA_RADIUS * cardsAbove;

        inner.style.transform = `scale(${Math.max(scale, 0.86)})`;
        inner.style.opacity = `${Math.max(opacity, 0.55)}`;
        inner.style.borderRadius = `${radius}px`;
      } else {
        // Card hasn't reached its sticky position yet — untouched
        inner.style.transform = '';
        inner.style.opacity = '';
        inner.style.borderRadius = '';
      }
    });
  }

  /* ===========================
     FADE-IN ON SCROLL
     =========================== */
  function initFadeAnimations() {
    const selectors = [
      '.hero-text h1',
      '.hero-bio',
      '.hero-photo-card',
      '.section-title',
      '.award-card',
      '.speaking-card',
      '.course-card',
      '.footer-inner'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('fade-up');
        el.style.transitionDelay = `${i * 0.1}s`;
      });
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  /* ===========================
     NAV HIGHLIGHT
     =========================== */
  function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function update() {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    }

    window.addEventListener('scroll', update, { passive: true });
  }

  /* ===========================
     NAV SHADOW
     =========================== */
  function initNavShadow() {
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 50
        ? '0 2px 20px rgba(0,0,0,0.06)'
        : 'none';
    }, { passive: true });
  }

  /* ===========================
     HERO PARALLAX
     =========================== */
  function initHeroParallax() {
    const card = document.querySelector('.hero-photo-card');
    if (!card) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        card.style.transform = `translateY(${window.scrollY * 0.06}px)`;
      }
    }, { passive: true });
  }

  /* ===========================
     rAF THROTTLE
     =========================== */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleStackScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  /* ===========================
     INIT
     =========================== */
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', handleStackScroll, { passive: true });

  document.addEventListener('DOMContentLoaded', () => {
    initFadeAnimations();
    initNavHighlight();
    initNavShadow();
    initHeroParallax();
    handleStackScroll();
  });
})();
