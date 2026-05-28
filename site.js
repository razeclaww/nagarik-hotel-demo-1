// =============================================
// EmailJS Configuration
// =============================================
// TODO: Paste your EmailJS credentials below.
//   1. Get your Public Key:   https://dashboard.emailjs.com/admin/account
//   2. Create an email Service and copy its Service ID
//   3. Create email Templates and copy their Template IDs
const EMAILJS_PUBLIC_KEY    = ''; // e.g. 'abcDEF123XYZ'
const EMAILJS_SERVICE_ID    = ''; // e.g. 'service_xxx'
const BOOKING_TEMPLATE_ID   = ''; // e.g. 'template_booking'
const CONTACT_TEMPLATE_ID   = ''; // e.g. 'template_contact'

// Initialize EmailJS (safe even if key is empty — calls will just fail gracefully)
if (window.emailjs && EMAILJS_PUBLIC_KEY) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

// =============================================
// Navbar — scroll state + mobile toggle
// =============================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// =============================================
// Reveal on scroll
// =============================================
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// =============================================
// Gallery Lightbox
// =============================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
  });
});
function closeLightbox() { lightbox.classList.remove('open'); lightboxImg.src = ''; }
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// =============================================
// Forms — EmailJS handlers
// =============================================
function setStatus(el, msg, type) {
  el.textContent = msg;
  el.className = 'form-status ' + (type || '');
}

function handleEmailForm(form, statusEl, templateId, successMsg) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    // Guard: warn if EmailJS is not configured yet
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !templateId) {
      setStatus(statusEl,
        'Form captured locally. Add your EmailJS credentials in site.js to enable email delivery.',
        'error'
      );
      console.log('[Form submission]', data);
      return;
    }

    setStatus(statusEl, 'Sending…', '');
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, templateId, data);
      setStatus(statusEl, successMsg, 'success');
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus(statusEl, 'Something went wrong. Please try again or call us directly.', 'error');
    }
  });
}

const bookingForm = document.getElementById('bookingForm');
const contactForm = document.getElementById('contactForm');
handleEmailForm(bookingForm, document.getElementById('bookingStatus'), BOOKING_TEMPLATE_ID,
  'Thank you — your booking request has been received. We will confirm shortly.');
handleEmailForm(contactForm, document.getElementById('contactStatus'), CONTACT_TEMPLATE_ID,
  'Thank you — your message has been sent. We will reply soon.');

// =============================================
// Footer year
// =============================================
document.getElementById('year').textContent = new Date().getFullYear();
