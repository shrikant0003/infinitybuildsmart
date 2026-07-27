// Splash screen: fade out once the animation has played and the page has loaded
const splash = document.getElementById('splash');
if (splash && document.documentElement.classList.contains('splash-lock')) {
  const MIN_DISPLAY = 2850;
  const start = performance.now();
  let hidden = false;
  const hideSplash = () => {
    if (hidden) return;
    hidden = true;
    const wait = Math.max(MIN_DISPLAY - (performance.now() - start), 0);
    setTimeout(() => {
      splash.classList.add('splash-hide');
      document.documentElement.classList.remove('splash-lock');
      splash.addEventListener('transitionend', () => splash.remove(), { once: true });
    }, wait);
  };
  if (document.readyState === 'complete') hideSplash();
  else window.addEventListener('load', hideSplash);
  setTimeout(hideSplash, 5000); // safety net if load never fires
}

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

// Stagger siblings that reveal together (e.g. cards in the same grid)
const revealGroups = new Map();
revealEls.forEach(el => {
  const group = revealGroups.get(el.parentElement) || [];
  group.push(el);
  revealGroups.set(el.parentElement, group);
});
revealGroups.forEach(group => {
  group.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 6) * 90}ms`;
  });
});

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

// Lightbox: click a plan drawing to view it full-size (scroll to read measurements)
const planImgs = document.querySelectorAll('.plan-card img');
if (planImgs.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<img alt=""><span class="lightbox-hint">Scroll to inspect · Click anywhere or press Esc to close</span>';
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('img');

  planImgs.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// Contact form — submits via EmailJS (works from static hosting, emails infinitydevelopers.bgm@gmail.com)
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: bots fill every field, real visitors never see or check this one
    if (form.botcheck.checked) {
      formNote.textContent = 'Thanks! We\'ve received your message and will get back to you soon.';
      form.reset();
      return;
    }

    const name = document.getElementById('name').value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    formNote.textContent = 'Sending...';
    try {
      await emailjs.sendForm('YOUR_EMAILJS_SERVICE_ID', 'YOUR_EMAILJS_TEMPLATE_ID', form);
      formNote.textContent = `Thanks${name ? ', ' + name : ''}! We've received your message and will get back to you soon.`;
      form.reset();
    } catch (err) {
      formNote.textContent = 'Something went wrong sending your message. Please email us directly at infinitydevelopers.bgm@gmail.com.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}
