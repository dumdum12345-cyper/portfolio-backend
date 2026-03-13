document.addEventListener('DOMContentLoaded', () => {

  /* ── TYPED HERO TEXT ── */
  const roles = ['Software Developer', 'Web Developer', 'Problem Solver', 'BCA Final Year', 'Builder of Things'];
  const typedEl = document.getElementById('typed');
  let ri = 0, ci = 0, deleting = false;
  function type() {
    if (!typedEl) return;
    const word = roles[ri];
    typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) { setTimeout(() => { deleting = true; type(); }, 1800); return; }
    if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();

  /* ── HERO FADE-UP ON LOAD ── */
  document.querySelectorAll('.fade-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), 200 + i * 80);
  });

  /* ── NAVBAR ── */
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.background = ''; a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) { a.style.background = 'var(--orange)'; a.style.color = '#fff'; }
    });
  });

  /* ── MOBILE MENU ── */
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const bars = burger.querySelectorAll('span');
    const open = navLinks.classList.contains('open');
    bars[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
    bars[1].style.opacity   = open ? '0' : '1';
    bars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  }));

  /* ── SCROLL REVEAL ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── COUNT-UP STATS ── */
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.astat-n').forEach(el => {
        const target = +el.dataset.target; let n = 0;
        const step = () => { n += Math.ceil(target / 24); el.textContent = Math.min(n, target); if (n < target) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
      statsObs.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  const statsEl = document.querySelector('.about-stats');
  if (statsEl) statsObs.observe(statsEl);

  /* ── SKILL BARS ── */
  const barsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.sbar-fill').forEach(bar => { bar.style.width = bar.dataset.w + '%'; });
      barsObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  const skillsEl = document.querySelector('.skills-bars');
  if (skillsEl) barsObs.observe(skillsEl);

  /* ── CONTACT FORM — Formspree ── */
  const form = document.getElementById('contactForm');
  const msg  = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...'; btn.disabled = true;
      const data = {
        name:    form.querySelector('input[type="text"]').value,
        email:   form.querySelector('input[type="email"]').value,
        message: form.querySelector('textarea').value,
      };
      try {
        const res = await fetch('https://formspree.io/f/mreyqzzr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          msg.style.color = '#00c875';
          msg.textContent = '✓ Message sent! I\'ll get back to you soon.';
          form.reset();
        } else {
          msg.style.color = '#ff4d00';
          msg.textContent = '✗ Something went wrong. Please try again.';
        }
      } catch {
        msg.style.color = '#ff4d00';
        msg.textContent = '✗ Network error. Email me directly instead.';
      } finally {
        btn.textContent = 'Send Message'; btn.disabled = false;
      }
    });
  }

});