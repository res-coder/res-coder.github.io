/* ============================================================
   CLEAR PATH TCG — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. Initialize Feather Icons ───────────────────────── */
  if (typeof feather !== 'undefined') feather.replace();

  /* ── 2. Navbar: scroll state ───────────────────────────── */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ── 3. Mobile menu toggle ─────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ── 4. Active nav link on scroll ─────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navItems.forEach(function (n) { n.classList.remove('active'); });
        const match = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ── 5. Scroll fade-in animations ─────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Stagger cards in the same grid row
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
        const idx      = siblings.indexOf(entry.target);
        const delay    = (idx % 3) * 90;

        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);

        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(function (el) { fadeObserver.observe(el); });

  /* ── 6. FAQ accordion ──────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-q');

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── 7. Counter animation (Why Choose section) ─────────── */
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) { counterObserver.observe(el); });

  function animateCounter(el) {
    var target   = parseInt(el.dataset.target, 10);
    var duration = 1800;
    var start    = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  /* ── 8. Contact form → mailto ──────────────────────────── */
  var form = document.getElementById('contactForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = document.getElementById('c-name').value.trim();
    var email   = document.getElementById('c-email').value.trim();
    var phone   = document.getElementById('c-phone').value.trim();
    var org     = document.getElementById('c-org').value;
    var service = document.getElementById('c-service').value;
    var message = document.getElementById('c-msg').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      alert('Please fill in your name, email, and message before sending.');
      return;
    }

    var subject = 'New Inquiry from ' + name + ' — Clear Path TCG Website';

    var body =
      'Hi Clear Path TCG Team,\n\n' +
      'A new inquiry has come in through the website contact form.\n\n' +
      '--- Contact Details ---\n' +
      'Name:               ' + name + '\n' +
      'Email:              ' + email + '\n' +
      'Phone:              ' + (phone || 'Not provided') + '\n' +
      'Organization Type:  ' + (org || 'Not specified') + '\n' +
      'Service Interested: ' + (service || 'Not specified') + '\n\n' +
      '--- Message ---\n' +
      message + '\n\n' +
      '---\n' +
      'Sent from the Clear Path TCG website contact form.\n' +
      'clearpathcg.com';

    var mailto = 'mailto:clearpathtcg@gmail.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body='    + encodeURIComponent(body);

    window.location.href = mailto;
  });

  /* ── 9. Smooth scroll (fallback for older browsers) ────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id     = this.getAttribute('href');
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      var top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

});
