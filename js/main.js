// Sticky header background on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// Animated stat counters
const stats = document.querySelectorAll('.stat-num');
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
};
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
stats.forEach(stat => statsObserver.observe(stat));

// Hero background carousel
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let activeSlide = 0;
  setInterval(() => {
    heroSlides[activeSlide].classList.remove('active');
    activeSlide = (activeSlide + 1) % heroSlides.length;
    heroSlides[activeSlide].classList.add('active');
  }, 5000);
}

// Scroll-reveal animation
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Safety net: guarantee nothing stays invisible if the observer is slow/unsupported
setTimeout(() => {
  revealEls.forEach(el => el.classList.add('visible'));
}, 1500);

// Active nav link highlighting on scroll
const navLinks = document.querySelectorAll('.main-nav a[data-nav]');
const sections = Array.from(navLinks)
  .map(link => document.getElementById(link.dataset.nav))
  .filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = document.querySelector(`.main-nav a[data-nav="${entry.target.id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(section => sectionObserver.observe(section));

// Contact form (static hosting: no backend, so just confirm client-side)
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    formNote.textContent = `Thanks${name ? ', ' + name : ''}! To finish sending this, connect the form to Formspree/EmailJS or Hostinger's form handler — see deployment notes.`;
    form.reset();
  });
}
