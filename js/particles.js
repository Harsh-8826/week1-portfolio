/* ==========================================================================
   particles.js — lightweight canvas particle network for the hero section
   ========================================================================== */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const LINE_COLOR = '0, 229, 255';   // matches --color-primary
  const DOT_COLOR = '0, 255, 163';    // matches --color-accent
  const LINK_DISTANCE = 140;
  const MAX_PARTICLES = 90;

  let width, height, particles, rafId;
  let mouse = { x: null, y: null, radius: 160 };

  function resize() {
    const hero = canvas.parentElement;
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    const density = Math.floor((width * height) / 16000);
    const count = Math.max(30, Math.min(MAX_PARTICLES, density));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.6,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Move particles, with a gentle push away from the mouse
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / (dist || 1)) * force * 1.2;
          p.y += (dy / (dist || 1)) * force * 1.2;
        }
      }

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    // Draw links between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DISTANCE) {
          const opacity = 1 - dist / LINK_DISTANCE;
          ctx.strokeStyle = `rgba(${LINE_COLOR}, ${opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw the particles themselves
    for (const p of particles) {
      ctx.fillStyle = `rgba(${DOT_COLOR}, 0.85)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  function trackMouse(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function clearMouse() {
    mouse.x = null;
    mouse.y = null;
  }

  function init() {
    resize();
    createParticles();
    cancelAnimationFrame(rafId);

    if (prefersReducedMotion) {
      // Draw a single static frame for reduced-motion users
      draw();
      cancelAnimationFrame(rafId);
    } else {
      draw();
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });

  canvas.addEventListener('mousemove', trackMouse);
  canvas.addEventListener('mouseleave', clearMouse);

  init();
})();
