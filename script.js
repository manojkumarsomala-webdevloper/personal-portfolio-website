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

    /* Fade-up on scroll */
    const fadeEls = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (i % 4) * 0.1 + 's';
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => fadeObserver.observe(el));

    /* Contact form submit */
    function handleSubmit() {
      const name  = document.getElementById('nameInput').value.trim();
      const phone = document.getElementById('phoneInput').value.trim();
      const msg   = document.getElementById('formMsg');
      if (!name || !phone) {
        msg.style.color = '#e53e3e';
        msg.textContent = 'Please fill in both fields.';
        msg.style.display = 'block';
        return;
      }
      msg.style.color = 'var(--purple)';
      msg.textContent = `Thanks ${name}! Message sent. I'll get back to you soon 🚀`;
      msg.style.display = 'block';
      document.getElementById('nameInput').value  = '';
      document.getElementById('phoneInput').value = '';
      setTimeout(() => { msg.style.display = 'none'; }, 5000);
    }