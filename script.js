/* =============================================
   LANGUAGE TOGGLE
   ============================================= */
let currentLang = 'pt';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  document.querySelectorAll('[data-pt][data-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  document.getElementById('langPT').classList.toggle('active', lang === 'pt');
  document.getElementById('langEN').classList.toggle('active', lang === 'en');
}

document.getElementById('langToggle').addEventListener('click', () => {
  setLanguage(currentLang === 'pt' ? 'en' : 'pt');
});

/* =============================================
   TYPEWRITER
   ============================================= */
const roles = {
  pt: ['Engenheira de Dados', 'Desenvolvedora Backend', 'Pesquisadora em IA', 'Solucionadora de Problemas'],
  en: ['Data Engineer', 'Backend Developer', 'AI Researcher', 'Problem Solver'],
};

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const words = roles[currentLang];
  const current = words[roleIndex % words.length];

  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typeEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex++;
    delay = 400;
  }

  setTimeout(type, delay);
}

setTimeout(type, 800);

/* =============================================
   HEADER — GRADIENT ON SCROLL
   ============================================= */
const header = document.getElementById('header');

function updateHeader() {
  const p = Math.min(window.scrollY / 200, 1);
  // Ease-in so the gradient appears quickly as you start scrolling
  const eased = Math.pow(p, 0.55);

  if (p < 0.02) {
    // Fully transparent at the very top
    header.style.background = 'transparent';
    header.style.backdropFilter = 'none';
    header.style.webkitBackdropFilter = 'none';
    header.style.boxShadow = '';
  } else {
    const alpha = eased * 0.97;
    // Diagonal purple gradient (more dramatic than a solid colour)
    header.style.background =
      `linear-gradient(135deg,
        rgba(109,40,217,${alpha}) 0%,
        rgba(147,51,234,${alpha * 0.88}) 50%,
        rgba(124,58,237,${alpha * 0.95}) 100%)`;
    header.style.backdropFilter = `blur(${eased * 14}px)`;
    header.style.webkitBackdropFilter = `blur(${eased * 14}px)`;
    header.style.boxShadow = eased > 0.25
      ? `0 4px 40px rgba(109,40,217,${eased * 0.38})`
      : '';
  }

  // Flip link/logo colours at 40% of scroll
  header.classList.toggle('scrolled', p > 0.4);
  updateActiveNav();
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* =============================================
   ACTIVE NAV HIGHLIGHT
   ============================================= */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* =============================================
   MOBILE MENU
   ============================================= */
const burger = document.getElementById('navBurger');
const menu   = document.getElementById('navMenu');

burger.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

menu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
  });
});

/* =============================================
   SCROLL REVEAL
   ============================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =============================================
   IMAGE LIGHTBOX MODAL
   ============================================= */
const modal       = document.getElementById('imgModal');
const modalImg    = document.getElementById('modalImg');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose  = document.getElementById('modalClose');

function openModal(src, alt) {
  modalImg.src = src;
  modalImg.alt = alt || '';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Clear src after transition to avoid flash on reopen
  setTimeout(() => { if (!modal.classList.contains('open')) modalImg.src = ''; }, 300);
}

modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Wire up all expandable images (courses + achievements)
document.querySelectorAll('.expandable-img img[data-modal]').forEach(img => {
  img.addEventListener('click', () => openModal(img.src, img.alt));
});

/* =============================================
   FLIP CARDS — TOUCH / CLICK TOGGLE (mobile)
   ============================================= */
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (!isTouchDevice()) return; // hover handles it on desktop
    // If clicking the CTA link on the back, let it navigate normally
    if (e.target.closest('.flip-card__cta')) return;
    card.classList.toggle('flipped');
  });

  // Allow keyboard Enter/Space to flip
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});
