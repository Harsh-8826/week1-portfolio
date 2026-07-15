/* ==========================================================================
   animations.js — scroll reveals, counters, skill bars/rings, typing effect,
   project filtering, testimonial slider, FAQ accordion, custom cursor
   ========================================================================== */

(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if (prefersReducedMotion) {
      counters.forEach((el) => { el.textContent = el.getAttribute('data-target'); });
    } else if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach((el) => { el.textContent = el.getAttribute('data-target'); });
    }
  }

  /* ---------------- Animated skill bars ---------------- */
  const barSkills = document.querySelectorAll('.bar-skill');

  function fillBar(el) {
    const percent = el.getAttribute('data-percent') || '0';
    const fill = el.querySelector('.bar-fill');
    if (fill) fill.style.width = percent + '%';
  }

  if (barSkills.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      barSkills.forEach(fillBar);
    } else {
      const barObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fillBar(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      barSkills.forEach((el) => barObserver.observe(el));
    }
  }

  /* ---------------- Circular skill indicators ---------------- */
  const ringSkills = document.querySelectorAll('.ring-skill');
  const RING_CIRCUMFERENCE = 264; // matches stroke-dasharray in CSS

  function fillRing(el) {
    const percent = parseInt(el.getAttribute('data-percent'), 10) || 0;
    const ringFill = el.querySelector('.ring-fill');
    const ringPercent = el.querySelector('.ring-percent');
    const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;

    if (ringFill) ringFill.style.strokeDashoffset = offset;

    if (ringPercent) {
      if (prefersReducedMotion) {
        ringPercent.textContent = percent + '%';
        return;
      }
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        ringPercent.textContent = Math.round(progress * percent) + '%';
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }

  if (ringSkills.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      ringSkills.forEach(fillRing);
    } else {
      const ringObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fillRing(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      ringSkills.forEach((el) => ringObserver.observe(el));
    }
  }

  /* ---------------- Typing effect (hero role) ---------------- */
  const typingTarget = document.getElementById('typing-target');
  const roles = [
    'Cyber Security Engineer',
    'Penetration Tester',
    'Security Researcher',
    'Full Stack Developer',
  ];

  if (typingTarget) {
    if (prefersReducedMotion) {
      typingTarget.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      function typeLoop() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
          charIndex++;
          typingTarget.textContent = currentRole.slice(0, charIndex);
          if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeLoop, 1600);
            return;
          }
        } else {
          charIndex--;
          typingTarget.textContent = currentRole.slice(0, charIndex);
          if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }

        setTimeout(typeLoop, isDeleting ? 40 : 70);
      }

      typeLoop();
    }
  }

  /* ---------------- Project filtering ---------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        const show = filter === 'all' || categories.includes(filter);
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------------- Testimonial slider ---------------- */
  const track = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (track && dotsWrap) {
    const slides = Array.from(track.querySelectorAll('.testimonial-card'));
    let activeIndex = 0;
    let autoTimer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot';
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.querySelectorAll('.testimonial-dot'));

    function render() {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === activeIndex));
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
    }

    function goTo(index) {
      activeIndex = (index + slides.length) % slides.length;
      render();
      restartAutoplay();
    }

    function restartAutoplay() {
      clearInterval(autoTimer);
      if (!prefersReducedMotion) {
        autoTimer = setInterval(() => goTo(activeIndex + 1), 6000);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(activeIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(activeIndex + 1));

    render();
    restartAutoplay();
  }

  /* ---------------- FAQ accordion ---------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        const q = other.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------- Custom cursor ---------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursorDot && cursorRing && isFinePointer) {
    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    function animateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveEls = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card');
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  } else if (cursorDot && cursorRing) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }
})();
