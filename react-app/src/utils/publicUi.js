const API_BASE = 'https://backend-w0at.onrender.com/api';

export const initScrollAnimations = (threshold = 0.12) => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('animate-visible')),
    { threshold }
  );
  document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
  return () => observer.disconnect();
};

export const initWhyAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('animate-visible')),
    { threshold: 0.45 }
  );
  document.querySelectorAll('.why-line').forEach((el) => observer.observe(el));
  return () => observer.disconnect();
};

export const initTestimonialsTrack = (id = 'testimonials-track') => {
  const track = document.getElementById(id);
  if (track) track.innerHTML += track.innerHTML;
};

export const initSidebar = () => {
  const sidebarBtn = document.getElementById('sidebar-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarClose = document.getElementById('sidebar-close');
  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('open');
  };
  const openSidebar = () => {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('open');
  };

  if (sidebarBtn) sidebarBtn.addEventListener('click', openSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebar) sidebar.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeSidebar));

  return () => {
    if (sidebarBtn) sidebarBtn.removeEventListener('click', openSidebar);
    if (sidebarOverlay) sidebarOverlay.removeEventListener('click', closeSidebar);
    if (sidebarClose) sidebarClose.removeEventListener('click', closeSidebar);
    if (sidebar) sidebar.querySelectorAll('a').forEach((a) => a.removeEventListener('click', closeSidebar));
  };
};

export const initFaq = () => {
  const handlers = [];
  document.querySelectorAll('.faq-q').forEach((q) => {
    const handler = () => {
      const card = q.closest('.faq');
      if (card) card.classList.toggle('open');
    };
    q.addEventListener('click', handler);
    handlers.push([q, handler]);
  });
  return () => handlers.forEach(([q, handler]) => q.removeEventListener('click', handler));
};

export const initGetQuote = () => {
  const deliveryButtons = document.querySelectorAll('[data-delivery]');
  const deliveryTypeInput = document.getElementById('deliveryType');
  const defaultPricing = {
    base: 32,
    perKg: 1.4,
    expressMultiplier: 1.4,
    type: {
      document: { factor: 0.9, perKg: 0.7 },
      box: { factor: 1, perKg: 1.4 },
      pallet: { factor: 1.45, perKg: 1.8 },
      fragile: { factor: 1.35, perKg: 1.7 }
    }
  };
  let pricingConfig = null;

  const loadPricing = async () => {
    try {
      const res = await fetch(`${API_BASE}/pricing`);
      if (res.ok) pricingConfig = await res.json();
    } catch (err) {
      pricingConfig = null;
    }
  };

  const calcPrice = () => {
    const pricing = pricingConfig || defaultPricing;
    const weight = Math.max(1, Number(document.getElementById('weight')?.value) || 1);
    const type = document.getElementById('packageType')?.value;
    const deliveryType = deliveryTypeInput?.value || 'standard';

    const typeCfg = (pricing.type && pricing.type[type]) || {};
    const base = Number(pricing.base) || 32;
    const perKg = Number(typeCfg.perKg) || Number(pricing.perKg) || 1.4;
    const typeFactor = Number(typeCfg.factor) || 1;
    const expressMultiplier = Number(pricing.expressMultiplier) || 1.4;

    let subtotal = (base + weight * perKg) * typeFactor;
    if (deliveryType === 'express') subtotal *= expressMultiplier;

    const finalPrice = Math.round(subtotal * 100) / 100;
    const priceOutput = document.getElementById('priceOutput');
    const etaOutput = document.getElementById('etaOutput');
    const pickupOut = document.getElementById('pickupOut');
    const deliveryOut = document.getElementById('deliveryOut');
    const weightOut = document.getElementById('weightOut');
    const serviceOut = document.getElementById('serviceOut');

    if (priceOutput) priceOutput.textContent = `GBP ${finalPrice.toFixed(2)}`;
    if (etaOutput) etaOutput.textContent = deliveryType === 'express' ? 'Estimated transit: 24-48 hours' : 'Estimated transit: 2-3 business days';
    if (pickupOut) pickupOut.textContent = document.getElementById('pickup')?.value || 'Not set';
    if (deliveryOut) deliveryOut.textContent = document.getElementById('delivery')?.value || 'Not set';
    if (weightOut) weightOut.textContent = `${weight} kg`;
    if (serviceOut) serviceOut.textContent = deliveryType === 'express' ? 'Express' : 'Standard';
  };

  const onDeliveryClick = (button) => {
    deliveryButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    if (deliveryTypeInput) deliveryTypeInput.value = button.dataset.delivery;
    calcPrice();
  };

  const inputIds = ['pickup', 'delivery', 'weight', 'packageType'];
  const handlers = [];

  deliveryButtons.forEach((button) => {
    const handler = () => onDeliveryClick(button);
    button.addEventListener('click', handler);
    handlers.push([button, 'click', handler]);
  });

  inputIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const onInput = () => calcPrice();
    const onChange = () => calcPrice();
    el.addEventListener('input', onInput);
    el.addEventListener('change', onChange);
    handlers.push([el, 'input', onInput]);
    handlers.push([el, 'change', onChange]);
  });

  const form = document.getElementById('quoteForm');
  if (form) {
    const onSubmit = async (e) => {
      e.preventDefault();
      calcPrice();
      const payload = {
        name: document.getElementById('name')?.value.trim(),
        phone: document.getElementById('phone')?.value.trim(),
        email: document.getElementById('email')?.value.trim(),
        address: `${document.getElementById('pickup')?.value.trim()} -> ${document.getElementById('delivery')?.value.trim()}`,
        service: document.getElementById('deliveryType')?.value,
        weight: `${document.getElementById('weight')?.value} kg`,
        pickupDate: new Date().toISOString().slice(0, 10)
      };
      try {
        await fetch(`${API_BASE}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        alert('Quote request submitted successfully. Our team will contact you shortly.');
      } catch (err) {
        alert('Failed to submit quote. Please try again.');
      }
    };
    form.addEventListener('submit', onSubmit);
    handlers.push([form, 'submit', onSubmit]);
  }

  loadPricing().then(calcPrice);

  return () => handlers.forEach(([el, evt, handler]) => el.removeEventListener(evt, handler));
};

export const initShipmentTracking = () => {
  const stepMap = {
    'Shipment Booked': 0,
    'Picked Up': 1,
    'In Transit': 2,
    'Arrived at Hub': 2,
    'Out for Delivery': 3,
    'Delivered': 4,
    Pending: 0
  };

  const formatEta = (val) => {
    if (!val) return '-';
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderStatus = (data) => {
    document.querySelectorAll('#timeline .step').forEach((el, i) => {
      el.classList.remove('done', 'current');
      if (i < data.step) el.classList.add('done');
      if (i === data.step) el.classList.add(data.step === 4 ? 'done' : 'current');
    });
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    setText('current-location', data.location);
    setText('eta', data.eta);
    setText('confirmation', data.confirmation);
    setText('overall-status', data.overall);
  };

  const fetchShipment = async (trackingId) => {
    const res = await fetch(`${API_BASE}/shipments/${trackingId}`);
    if (!res.ok) throw new Error('not-found');
    return res.json();
  };

  const fetchTimeline = async (trackingId) => {
    const res = await fetch(`${API_BASE}/shipments/${trackingId}/timeline`);
    if (!res.ok) return [];
    return res.json();
  };

  const trackShipment = async (trackingId) => {
    const id = trackingId.trim().toUpperCase();
    if (!id) {
      alert('Enter a tracking ID');
      return;
    }
    try {
      const shipment = await fetchShipment(id);
      const timeline = await fetchTimeline(id);
      const latest = timeline[0];
      const step = stepMap[shipment.status] ?? 0;
      renderStatus({
        step,
        location: latest?.location || shipment.currentLocation || shipment.route || 'In Transit',
        eta: formatEta(shipment.eta),
        confirmation: shipment.status === 'Delivered' ? 'Delivered' : 'Pending',
        overall: shipment.status || 'Pending'
      });
    } catch (err) {
      alert('Tracking ID not found');
    }
  };

  const trackBtn = document.getElementById('track-btn');
  const trackingInput = document.getElementById('tracking-id');
  if (trackBtn && trackingInput) {
    const handler = () => trackShipment(trackingInput.value);
    trackBtn.addEventListener('click', handler);
  }

  document.querySelectorAll('.sample-id').forEach((btn) => {
    if (!trackingInput) return;
    btn.addEventListener('click', () => {
      trackingInput.value = btn.dataset.id;
      trackShipment(btn.dataset.id);
    });
  });
};

