
     /* Navbar scroll effect */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    /* Hamburger menu */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    /* Active nav link on scroll */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => observer.observe(s));

    /* ── Enhanced fade-up on scroll ─────────────────────────── */
    const allReveal = document.querySelectorAll('.fade-up, .reveal-left, .reveal-right, .reveal-scale');
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    allReveal.forEach(el => fadeObserver.observe(el));

    /* Apply extra reveal classes to section titles and about section */
    document.querySelectorAll('.about-title, .section-title').forEach(el => {
      el.classList.add('reveal-left');
      fadeObserver.observe(el);
    });
    document.querySelectorAll('.about-desc, .section-sub').forEach(el => {
      el.classList.add('reveal-right');
      fadeObserver.observe(el);
    });
    document.querySelectorAll('.stat-card').forEach((el, i) => {
      el.classList.add('reveal-scale');
      el.style.transitionDelay = (i * 0.2) + 's';
      fadeObserver.observe(el);
    });
    document.querySelectorAll('.process-step').forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = (i * 0.15) + 's';
      fadeObserver.observe(el);
    });
    document.querySelectorAll('.contact-item').forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = (i * 0.12) + 's';
      fadeObserver.observe(el);
    });

    /* ── Project image hover overlay ────────────────────────── */
    document.querySelectorAll('.project-img-placeholder').forEach(card => {
      // remove any old overlay first
      card.querySelectorAll('.project-overlay').forEach(o => o.remove());
      const overlay = document.createElement('div');
      overlay.className = 'project-overlay';
      overlay.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        View Project
      `;
      card.appendChild(overlay);
    });

    /* ── Inject email input into contact form ───────────────── */
    (function injectEmailField() {
      const form = document.getElementById('contactForm');
      const phoneInput = document.getElementById('phoneInput');
      if (!form || !phoneInput) return;
      const emailInp = document.createElement('input');
      emailInp.className = 'form-input';
      emailInp.type = 'email';
      emailInp.id = 'emailInput';
      emailInp.placeholder = 'Your Email';
      emailInp.required = true;
      form.insertBefore(emailInp, phoneInput);
      /* error spans */
      ['nameInput','emailInput','phoneInput'].forEach(id => {
        const inp = document.getElementById(id);
        const span = document.createElement('span');
        span.className = 'field-error-msg';
        span.id = id + 'Err';
        inp.parentNode.insertBefore(span, inp.nextSibling);
      });
    })();

    /* Move success banner inside contact section */
    const contactSection = document.getElementById('contact');
    const successBanner  = document.getElementById('formSuccessBanner');
    if (contactSection && successBanner) {
      contactSection.querySelector('.container').appendChild(successBanner);
    }

    /* ── Form validation + send to WhatsApp + Email ─────────── */
    function showFieldError(id, msg) {
      const inp = document.getElementById(id);
      const err = document.getElementById(id + 'Err');
      inp.classList.add('error');
      inp.classList.remove('success-field');
      if (err) { err.textContent = msg; err.classList.add('show'); }
    }
    function clearFieldError(id) {
      const inp = document.getElementById(id);
      const err = document.getElementById(id + 'Err');
      inp.classList.remove('error');
      inp.classList.add('success-field');
      if (err) err.classList.remove('show');
    }

    function handleSubmit() {
      const nameInp  = document.getElementById('nameInput');
      const emailInp = document.getElementById('emailInput');
      const phoneInp = document.getElementById('phoneInput');
      const legacyMsg = document.getElementById('formMsg');
      if (legacyMsg) legacyMsg.style.display = 'none';

      const name  = nameInp  ? nameInp.value.trim()  : '';
      const email = emailInp ? emailInp.value.trim() : '';
      const phone = phoneInp ? phoneInp.value.trim() : '';

      let valid = true;

      /* Validate Name */
      if (!name) {
        showFieldError('nameInput', 'Please enter your name.');
        valid = false;
      } else { clearFieldError('nameInput'); }

      /* Validate Email */
      if (emailInp) {
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          showFieldError('emailInput', 'Please enter your email.');
          valid = false;
        } else if (!emailRx.test(email)) {
          showFieldError('emailInput', 'Please enter a valid email address.');
          valid = false;
        } else { clearFieldError('emailInput'); }
      }

      /* Validate Phone */
      const phoneRx = /^[+\d\s\-()]{7,15}$/;
      if (!phone) {
        showFieldError('phoneInput', 'Please enter your mobile number.');
        valid = false;
      } else if (!phoneRx.test(phone)) {
        showFieldError('phoneInput', 'Please enter a valid phone number.');
        valid = false;
      } else { clearFieldError('phoneInput'); }

      if (!valid) return;

      /* ── Send to WhatsApp ──────────────────────────────────── */
      const waText = encodeURIComponent(
        `Hi Manoj! 👋\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nI'd like to discuss a project with you.`
      );
      window.open(`https://wa.me/918499949968?text=${waText}`, '_blank');

      /* ── Send via Email (mailto) ───────────────────────────── */
      const mailSubject = encodeURIComponent(`New Project Inquiry from ${name}`);
      const mailBody    = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nSent from portfolio contact form.`
      );
      setTimeout(() => {
        window.location.href = `mailto:manojkuamrsomala@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      }, 600);

      /* ── Show success banner ───────────────────────────────── */
      const banner = document.getElementById('formSuccessBanner');
      const msgEl  = document.getElementById('successMsg');
      if (msgEl) msgEl.textContent = `Thanks ${name}! Your message is on its way. I'll get back to you soon 🚀`;
      if (banner) banner.classList.add('show');

      /* Clear form */
      if (nameInp)  { nameInp.value  = ''; nameInp.classList.remove('success-field'); }
      if (emailInp) { emailInp.value = ''; emailInp.classList.remove('success-field'); }
      if (phoneInp) { phoneInp.value = ''; phoneInp.classList.remove('success-field'); }

      setTimeout(() => { if (banner) banner.classList.remove('show'); }, 7000);
    }

    /* ── Live input validation feedback ─────────────────────── */
    ['nameInput','emailInput','phoneInput'].forEach(id => {
      const inp = document.getElementById(id);
      if (!inp) return;
      inp.addEventListener('input', () => {
        if (inp.value.trim()) {
          inp.classList.remove('error');
          inp.classList.add('success-field');
          const err = document.getElementById(id + 'Err');
          if (err) err.classList.remove('show');
        }
      });
      inp.addEventListener('blur', () => {
        if (!inp.value.trim()) {
          inp.classList.add('error');
          inp.classList.remove('success-field');
        }
      });
    });

    /* ── Make phone + email contact values clickable ─────────── */
    (function makeContactsClickable() {
      const phone = '+918499949968';
      const email = 'manojkuamrsomala@gmail.com';
      /* About section contact values */
      document.querySelectorAll('.contact-val').forEach(el => {
        const text = el.textContent.trim();
        if (/[\d\s\+\-\(\)]{7,}/.test(text) && text.replace(/\D/g,'').length >= 7) {
          const a = document.createElement('a');
          a.href = `tel:${phone}`;
          a.className = 'contact-link-tel';
          a.textContent = el.textContent;
          el.textContent = '';
          el.appendChild(a);
        } else if (text.includes('@')) {
          const a = document.createElement('a');
          a.href = `mailto:${email}`;
          a.className = 'contact-link-mail';
          a.textContent = el.textContent;
          el.textContent = '';
          el.appendChild(a);
        }
      });
      /* Footer contact items */
      document.querySelectorAll('.footer-contact-item span').forEach(el => {
        const text = el.textContent.trim();
        if (/[\d\s\+]{7,}/.test(text) && text.replace(/\D/g,'').length >= 7) {
          const a = document.createElement('a');
          a.href = `tel:${phone}`;
          a.className = 'contact-link-tel';
          a.style.color = 'inherit';
          a.textContent = el.textContent;
          el.textContent = '';
          el.appendChild(a);
        } else if (text.includes('@')) {
          const a = document.createElement('a');
          a.href = `mailto:${email}`;
          a.className = 'contact-link-mail';
          a.style.color = 'inherit';
          a.textContent = el.textContent;
          el.textContent = '';
          el.appendChild(a);
        }
      });
    })();

