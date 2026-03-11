document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      menuBtn.innerHTML = mobileMenu.classList.contains('open')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }
  const closeBtn = document.querySelector('.menu-close');
  if (closeBtn && mobileMenu && menuBtn) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  }
  document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-menu-toggle');
      const panel = document.querySelector(`[data-menu-panel=\"${key}\"]`);
      if (panel) panel.classList.toggle('open');
    });
  });

  const trackForm = document.getElementById('track-form');
  if (trackForm) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const result = document.getElementById('track-result');
      if (result) result.classList.remove('hidden');
    });
  }

  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const weight = parseFloat(document.getElementById('weight')?.value || '0');
      const output = document.getElementById('quote-output');
      if (output && weight > 0) {
        const total = (weight * 2.4 + 55).toFixed(2);
        output.textContent = `Estimated Price: GBP ${total}`;
        output.classList.remove('hidden');
      }
    });
  }
});
