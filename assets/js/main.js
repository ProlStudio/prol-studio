/* ============================================================
   PROL Studio — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll state ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ── */
  const burger = document.querySelector('.navbar__burger');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('active');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', String(open));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── FAQ accordion ── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Plans toggle (monthly / annual) ── */
  const planToggle = document.querySelectorAll('.plans__toggle-btn');
  if (planToggle.length) {
    planToggle.forEach(btn => {
      btn.addEventListener('click', () => {
        planToggle.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const period = btn.dataset.period;
        document.querySelectorAll('[data-price]').forEach(el => {
          el.textContent = el.dataset[period] || el.dataset.monthly;
        });
        document.querySelectorAll('[data-sub]').forEach(el => {
          el.innerHTML = el.dataset[period] || el.dataset.monthly;
        });
      });
    });
  }

  /* ── Contact form validation ── */
  const form = document.getElementById('contact-form');
  if (form) {
    const successMsg = document.getElementById('form-success');

    const required = form.querySelectorAll('[required]');

    const validateField = field => {
      const group = field.closest('.form__group');
      const error = group?.querySelector('.form__error');
      let valid = true;

      if (!field.value.trim()) {
        field.classList.add('invalid');
        if (error) { error.textContent = 'Este campo es obligatorio.'; error.classList.add('visible'); }
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.classList.add('invalid');
        if (error) { error.textContent = 'Ingresá un email válido.'; error.classList.add('visible'); }
        valid = false;
      } else {
        field.classList.remove('invalid');
        if (error) error.classList.remove('visible');
      }
      return valid;
    };

    required.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let allValid = true;
      required.forEach(field => { if (!validateField(field)) allValid = false; });

      if (allValid) {
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('visible');
      }
    });
  }

})();
