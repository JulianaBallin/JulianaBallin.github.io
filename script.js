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
   HEADER — SMOOTH GRADIENT ON SCROLL
   ============================================= */
const header = document.getElementById('header');

function updateHeader() {
  const progress = Math.min(window.scrollY / 160, 1);

  // Interpolate: light background (249,248,245) → purple (109,40,217)
  const r = Math.round(249 + (109 - 249) * progress);
  const g = Math.round(248 + (40  - 248) * progress);
  const b = Math.round(245 + (217 - 245) * progress);
  const a = 0.85 + (0.97 - 0.85) * progress;

  header.style.background = `rgba(${r},${g},${b},${a})`;

  // Use scrolled class at 50% threshold to flip text/link colours
  header.classList.toggle('scrolled', progress > 0.5);

  // Shadow fades in gradually
  if (progress > 0.08) {
    header.style.boxShadow = `0 4px 32px rgba(109,40,217,${progress * 0.28})`;
  } else {
    header.style.boxShadow = '';
  }

  updateActiveNav();
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader(); // initialise on page load

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
