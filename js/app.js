/* ==========================================================================
   app.js — app entry point: loading screen and contact form validation
   ========================================================================== */

(function () {
  /* ---------------- Loading screen ---------------- */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loader-progress');

  function hideLoader() {
    if (loaderProgress) loaderProgress.style.width = '100%';
    setTimeout(() => {
      if (loader) loader.classList.add('is-hidden');
      document.body.style.overflow = '';
    }, 250);
  }

  document.body.style.overflow = 'hidden';

  if (loaderProgress) {
    // Give the impression of real progress while the page finishes loading
    let progress = 0;
    const progressTimer = setInterval(() => {
      progress = Math.min(progress + Math.random() * 18, 92);
      loaderProgress.style.width = progress + '%';
    }, 140);

    window.addEventListener('load', () => {
      clearInterval(progressTimer);
      hideLoader();
    });
  } else {
    window.addEventListener('load', hideLoader);
  }

  // Safety net: never let the loader trap the user for more than 3.5s
  setTimeout(hideLoader, 3500);

  /* ---------------- Contact form validation ---------------- */
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (value) => value.trim().length > 1,
      message: 'Please enter your name.',
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: 'Please enter a valid email address.',
    },
    subject: {
      input: document.getElementById('subject'),
      error: document.getElementById('subject-error'),
      validate: (value) => value.trim().length > 2,
      message: 'Please add a short subject.',
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (value) => value.trim().length >= 10,
      message: 'Your message should be at least 10 characters.',
    },
  };

  function validateField(field) {
    const value = field.input.value;
    const valid = field.validate(value);
    const row = field.input.closest('.form-row');
    if (valid) {
      row.classList.remove('invalid');
      field.error.textContent = '';
    } else {
      row.classList.add('invalid');
      field.error.textContent = field.message;
    }
    return valid;
  }

  Object.values(fields).forEach((field) => {
    if (!field.input) return;
    field.input.addEventListener('blur', () => validateField(field));
    field.input.addEventListener('input', () => {
      if (field.input.closest('.form-row').classList.contains('invalid')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.values(fields).map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.style.color = '#ff5470';
      return;
    }

    // No backend is wired up in this template — connect this to your
    // mail service, form endpoint, or serverless function of choice.
    status.style.color = 'var(--color-accent)';
    status.textContent = 'Thanks! Your message has been noted (this demo form does not send yet).';
    form.reset();
  });
})();
