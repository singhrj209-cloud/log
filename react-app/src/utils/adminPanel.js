const API_BASE = 'https://backend-w0at.onrender.com/api';
const STORAGE = { auth: 'srj_admin_auth', selectedBooking: 'srj_selected_booking', editShipment: 'srj_edit_shipment' };
const statusOrder = [
  'Shipment Booked',
  'Picked Up',
  'In Transit',
  'Arrived at Hub',
  'Out for Delivery',
  'Delivered'
];

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const isLoggedIn = () => {
  const auth = load(STORAGE.auth, null);
  return !!(auth && auth.token);
};

const requireAuth = () => {
  const path = location.pathname;
  const isLogin = path === '/admin' || path === '/admin/login' || path.endsWith('admin-login.html');
  if (!isLoggedIn() && !isLogin) {
    location.href = '/admin/login';
  }
};

const logout = () => {
  localStorage.removeItem(STORAGE.auth);
  location.href = '/admin/login';
};

export const initLogin = () => {
  const form = document.getElementById('loginForm');
  if (!form) return;
  if (isLoggedIn()) { location.href = '/admin/dashboard'; return; }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    if (!username || !password) { alert('Enter username and password'); return; }
    save(STORAGE.auth, { token: 'demo-token', user: username, ts: Date.now() });
    location.href = '/admin/dashboard';
  });
};

const fetchJson = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
};

const formatDate = (val) => {
  if (!val) return '-';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const getNextTrackingId = async () => {
  const shipments = await fetchJson('/shipments');
  const max = shipments.reduce((m, s) => {
    const n = parseInt((s.trackingId || '').replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  const next = (max + 1).toString().padStart(3, '0');
  return `HBC${next}`;
};

const normalizeTrackingId = (value) => (value || '').trim().toUpperCase();

const promptTrackingId = async () => {
  const suggested = await getNextTrackingId();
  const input = prompt('Enter Tracking ID', suggested);
  const trackingId = normalizeTrackingId(input);
  if (!trackingId) return null;
  const shipments = await fetchJson('/shipments');
  const exists = shipments.some(s => normalizeTrackingId(s.trackingId) === trackingId);
  if (exists) {
    alert('Tracking ID already exists. Please try a new one.');
    return null;
  }
  return trackingId;
};

const promptEta = () => {
  const suggested = new Date().toISOString().slice(0, 10);
  const input = prompt('Enter ETA date (YYYY-MM-DD)', suggested);
  return (input || '').trim() || suggested;
};

export const initDashboard = async () => {
  const shipments = await fetchJson('/shipments');
  const total = shipments.length;
  const inTransit = shipments.filter(s => s.status === 'In Transit').length;
  const delivered = shipments.filter(s => s.status === 'Delivered').length;
  const pending = shipments.filter(s => s.status === 'Pending').length;
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText('statTotal', total);
  setText('statTransit', inTransit);
  setText('statDelivered', delivered);
  setText('statPending', pending);
  const tbody = document.getElementById('recentShipmentsBody');
  if (tbody) {
    const rows = shipments.slice(0, 6).map(s => {
      const statusClass = s.status === 'Delivered' ? 'green' : s.status === 'Pending' ? 'gray' : s.status === 'Out for Delivery' ? 'orange' : 'sky';
      return `<tr><td>${s.trackingId}</td><td>${s.route || '-'}</td><td><span class='badge ${statusClass}'>${s.status}</span></td><td>${formatDate(s.eta)}</td></tr>`;
    }).join('');
    tbody.innerHTML = rows || `<tr><td colspan='4'>No shipments yet</td></tr>`;
  }
};

export const initCreateShipment = async () => {
  const form = document.getElementById('createShipmentForm');
  const trackingInput = document.getElementById('trackingId');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  const pageTitle = document.querySelector('main h1');
  const pageLabel = document.querySelector('main .topbar p');
  const edit = load(STORAGE.editShipment, null);
  if (edit) {
    if (trackingInput) {
      trackingInput.value = edit.trackingId || '';
      trackingInput.setAttribute('readonly', 'readonly');
      trackingInput.classList.add('bg-slate-50');
    }
    const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined && val !== null) el.value = val; };
    set('senderName', edit.sender);
    set('senderAddress', edit.senderAddress);
    set('receiverName', edit.receiver);
    set('receiverAddress', edit.receiverAddress);
    set('phoneNumber', edit.phone);
    set('weight', edit.weight);
    set('shipmentType', edit.type);
    set('pickupDate', edit.pickupDate);
    set('shipmentStatus', edit.status);
    if (submitBtn) submitBtn.innerHTML = "<i class='fa-solid fa-pen'></i>Update Shipment";
    if (pageTitle) pageTitle.textContent = 'Edit Shipment';
    if (pageLabel) pageLabel.textContent = 'Update Shipment';
  } else {
    localStorage.removeItem(STORAGE.editShipment);
  }
  if (trackingInput && !trackingInput.value) {
    trackingInput.value = await getNextTrackingId();
  }
  const selected = load(STORAGE.selectedBooking, null);
  if (selected) {
    const sender = document.getElementById('senderName');
    const senderAddress = document.getElementById('senderAddress');
    const phone = document.getElementById('phoneNumber');
    if (sender && !sender.value) sender.value = selected.name || '';
    if (senderAddress && !senderAddress.value) senderAddress.value = selected.address || '';
    if (phone && !phone.value) phone.value = selected.phone || '';
  }
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      trackingId: document.getElementById('trackingId').value.trim() || await getNextTrackingId(),
      sender: document.getElementById('senderName').value.trim(),
      senderAddress: document.getElementById('senderAddress').value.trim(),
      receiver: document.getElementById('receiverName').value.trim(),
      receiverAddress: document.getElementById('receiverAddress').value.trim(),
      phone: document.getElementById('phoneNumber').value.trim(),
      weight: document.getElementById('weight').value.trim(),
      type: document.getElementById('shipmentType').value,
      pickupDate: document.getElementById('pickupDate').value,
      status: document.getElementById('shipmentStatus').value,
      route: `${document.getElementById('senderAddress').value.trim().split(',')[0] || 'Origin'} ? ${document.getElementById('receiverAddress').value.trim().split(',')[0] || 'Destination'}`,
      eta: document.getElementById('pickupDate').value
    };
    if (!data.sender || !data.receiver) { alert('Please fill sender and receiver names'); return; }
    if (edit) {
      const payload = {
        ...data,
        ...(edit.currentLocation ? { currentLocation: edit.currentLocation } : {}),
        deliveredAt: data.status === 'Delivered' ? (edit.deliveredAt || new Date().toISOString().slice(0, 10)) : null
      };
      await fetchJson(`/shipments/${edit.trackingId}`, { method: 'PATCH', body: JSON.stringify(payload) });
      alert('Shipment updated');
      localStorage.removeItem(STORAGE.editShipment);
    } else {
      await fetchJson('/shipments', { method: 'POST', body: JSON.stringify(data) });
      alert('Shipment created');
      localStorage.removeItem(STORAGE.selectedBooking);
    }
    location.href = '/admin/shipments';
  });
};

export const initShipmentList = async () => {
  const tbody = document.getElementById('shipmentsBody');
  if (!tbody) return;
  const render = async () => {
    const shipments = await fetchJson('/shipments');
    tbody.innerHTML = shipments.map(s => {
      const statusClass = s.status === 'Delivered' ? 'green' : s.status === 'Pending' ? 'gray' : s.status === 'Out for Delivery' ? 'orange' : 'sky';
      return `<tr>
        <td>${s.trackingId}</td>
        <td>${s.sender}</td>
        <td>${s.receiver}</td>
        <td><span class='badge ${statusClass}'>${s.status}</span></td>
        <td>${s.currentLocation || 'Not set'}</td>
        <td>${formatDate(s.eta)}</td>
        <td>${formatDate(s.deliveredAt)}</td>
        <td class='space-x-2'>
          <button class='action' data-action='edit' data-id='${s.trackingId}'><i class='fa-solid fa-pen'></i>Edit</button>
          <button class='action' data-action='status' data-id='${s.trackingId}'><i class='fa-solid fa-arrows-rotate'></i>Update Status</button>
          <button class='action danger' data-action='delete' data-id='${s.trackingId}'><i class='fa-solid fa-trash'></i>Delete</button>
        </td>
      </tr>`;
    }).join('') || `<tr><td colspan='8'>No shipments available</td></tr>`;
  };
  await render();
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'delete') {
      if (confirm(`Delete ${id}?`)) { await fetchJson(`/shipments/${id}`, { method: 'DELETE' }); await render(); }
    }
    if (action === 'status') {
      const row = btn.closest('tr');
      if (!row) return;
      const statusCell = row.children[3];
      const locationCell = row.children[4];
      const actionCell = row.children[7];
      const currentStatus = statusCell.textContent.trim();
      const select = document.createElement('select');
      select.className = 'border border-slate-200 rounded-lg px-2 py-1 text-sm';
      statusOrder.forEach((status) => {
        const opt = document.createElement('option');
        opt.value = status;
        opt.textContent = status;
        if (status === currentStatus) opt.selected = true;
        select.appendChild(opt);
      });
      const locationInput = document.createElement('input');
      locationInput.className = 'border border-slate-200 rounded-lg px-2 py-1 text-sm w-full';
      locationInput.placeholder = 'Enter location';
      locationInput.value = (locationCell.textContent || '').trim().replace('-', '');
      const saveBtn = document.createElement('button');
      saveBtn.className = 'action';
      saveBtn.textContent = 'Save';
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'action danger';
      cancelBtn.textContent = 'Cancel';
      statusCell.innerHTML = '';
      statusCell.appendChild(select);
      locationCell.innerHTML = '';
      locationCell.appendChild(locationInput);
      actionCell.innerHTML = '';
      actionCell.appendChild(saveBtn);
      actionCell.appendChild(cancelBtn);
      saveBtn.addEventListener('click', async () => {
        await fetchJson(`/shipments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: select.value, location: locationInput.value.trim() }) });
        await render();
      });
      cancelBtn.addEventListener('click', async () => {
        await render();
      });
    }
    if (action === 'edit') {
      try {
        const shipment = await fetchJson(`/shipments/${id}`);
        save(STORAGE.editShipment, shipment);
        location.href = '/admin/create-shipment';
      } catch (err) {
        alert('Unable to load shipment details.');
      }
    }
  });
};

export const initUpdateStatus = () => {
  const form = document.getElementById('updateStatusForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('updateTrackingId').value.trim();
    const status = document.getElementById('updateStatus').value;
    if (!id) { alert('Enter tracking ID'); return; }
    const updated = await fetchJson(`/shipments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    if (updated) alert('Status updated');
    else alert('Tracking ID not found');
  });
};

export const initTimeline = () => {
  const form = document.getElementById('timelineForm');
  const list = document.getElementById('timelineList');
  const trackingField = document.getElementById('timelineTrackingId');
  const render = async (trackingId) => {
    if (!trackingId || !list) return;
    const items = await fetchJson(`/shipments/${trackingId}/timeline`);
    list.innerHTML = items.map(t => {
      return `<div class='timeline-item'>
        <p class='text-xs uppercase text-slate-400'>${formatDate(t.date)}</p>
        <p class='font-semibold'>${t.status}</p>
        <p class='text-sm text-slate-500'>${t.location || ''}</p>
      </div>`;
    }).join('') || `<p class='text-sm text-slate-500'>No timeline updates yet.</p>`;
  };
  if (trackingField) {
    render(trackingField.value.trim());
    trackingField.addEventListener('input', () => render(trackingField.value.trim()));
  }
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const trackingId = document.getElementById('timelineTrackingId').value.trim();
    const date = document.getElementById('timelineDate').value;
    const location = document.getElementById('timelineLocation').value.trim();
    const status = document.getElementById('timelineStatus').value;
    const notes = document.getElementById('timelineNotes').value.trim();
    if (!trackingId) { alert('Enter tracking ID'); return; }
    await fetchJson(`/shipments/${trackingId}/timeline`, { method: 'POST', body: JSON.stringify({ date, status, location, notes }) });
    alert('Timeline updated');
    form.reset();
    document.getElementById('timelineDate').value = new Date().toISOString().slice(0, 10);
    render(trackingId);
  });
};

export const initPricing = async () => {
  const form = document.getElementById('pricingForm');
  if (!form) return;
  const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined && val !== null) el.value = val; };
  const num = (id, fallback) => {
    const val = parseFloat(document.getElementById(id).value);
    return Number.isFinite(val) ? val : fallback;
  };
  const loadPricing = async () => {
    const p = await fetchJson('/pricing');
    setVal('basePrice', p.base);
    setVal('defaultPerKg', p.perKg);
    setVal('expressMultiplier', p.expressMultiplier);
    setVal('docFactor', p.type?.document?.factor);
    setVal('docPerKg', p.type?.document?.perKg);
    setVal('boxFactor', p.type?.box?.factor);
    setVal('boxPerKg', p.type?.box?.perKg);
    setVal('palletFactor', p.type?.pallet?.factor);
    setVal('palletPerKg', p.type?.pallet?.perKg);
    setVal('fragileFactor', p.type?.fragile?.factor);
    setVal('fragilePerKg', p.type?.fragile?.perKg);
    const updated = document.getElementById('pricingUpdated');
    if (updated && p.updatedAt) updated.textContent = formatDate(p.updatedAt);
  };
  await loadPricing();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      base: num('basePrice', 32),
      perKg: num('defaultPerKg', 1.4),
      expressMultiplier: num('expressMultiplier', 1.4),
      type: {
        document: { factor: num('docFactor', 0.9), perKg: num('docPerKg', 0.7) },
        box: { factor: num('boxFactor', 1), perKg: num('boxPerKg', 1.4) },
        pallet: { factor: num('palletFactor', 1.45), perKg: num('palletPerKg', 1.8) },
        fragile: { factor: num('fragileFactor', 1.35), perKg: num('fragilePerKg', 1.7) }
      }
    };
    await fetchJson('/pricing', { method: 'PUT', body: JSON.stringify(payload) });
    alert('Pricing updated');
    await loadPricing();
  });
};

export const initCustomers = () => {
  const tbody = document.getElementById('customersBody');
  const count = document.getElementById('customerCount');
  const render = async () => {
    if (!tbody) return;
    const customers = await fetchJson('/bookings?limit=7');
    if (count) count.textContent = `${customers.length} Records`;
    tbody.innerHTML = customers.map(c => `
      <tr>
        <td>${c.trackingId || '-'}</td>
        <td>${c.name || '-'}</td>
        <td>${c.phone || '-'}</td>
        <td>${c.email || '-'}</td>
        <td>${c.address || '-'}</td>
      </tr>`).join('') || `<tr><td colspan='5'>No customers yet</td></tr>`;
  };
  render();
};

export const initBookings = () => {
  const tbody = document.getElementById('bookingsBody');
  const count = document.getElementById('bookingCount');
  const render = async () => {
    if (!tbody) return;
    const bookings = await fetchJson('/bookings?limit=200');
    if (count) count.textContent = `${bookings.length} Records`;
    tbody.innerHTML = bookings.map(b => `
      <tr>
        <td>${b.name || '-'}</td>
        <td>${b.phone || '-'}</td>
        <td>${b.email || '-'}</td>
        <td>${b.address || '-'}</td>
        <td>${b.service || '-'}</td>
        <td>${b.weight || '-'}</td>
        <td><input class='border border-slate-200 rounded-lg px-2 py-1 text-sm w-full' data-action='eta' data-id='${b._id}' value='${b.eta || ''}' placeholder='YYYY-MM-DD'></td>
        <td>${formatDate(b.createdAt || b.pickupDate)}</td>
        <td class='space-x-2'>
          <button class='action' data-action='add' data-booking='${encodeURIComponent(JSON.stringify(b))}'>Add to Shipment</button>
          <button class='action danger' data-action='delete' data-id='${b._id}'>Delete</button>
        </td>
      </tr>`).join('') || `<tr><td colspan='9'>No bookings yet</td></tr>`;
  };
  render();
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    if (action === 'delete') {
      const id = btn.getAttribute('data-id');
      if (!id) return;
      if (confirm('Delete this booking?')) {
        await fetchJson(`/bookings/${id}`, { method: 'DELETE' });
        render();
      }
    }
    if (action === 'add') {
      const raw = btn.getAttribute('data-booking');
      const booking = JSON.parse(decodeURIComponent(raw));
      save(STORAGE.selectedBooking, booking);
      const nextId = await promptTrackingId();
      if (!nextId) return;
      const eta = booking.eta || promptEta();
      const parts = (booking.address || '').split('->').map(s => s.trim());
      const route = parts.length >= 2 ? `${parts[0]} -> ${parts[1]}` : (booking.address || 'Origin -> Destination');
      let created = false;
      try {
        await fetchJson('/shipments', {
          method: 'POST',
          body: JSON.stringify({
            trackingId: nextId,
            sender: booking.name || 'Customer',
            senderAddress: parts[0] || booking.address || '',
            receiver: 'Receiver',
            receiverAddress: parts[1] || '',
            phone: booking.phone || '',
            weight: booking.weight || '',
            type: booking.service || 'Road',
            pickupDate: booking.pickupDate || new Date().toISOString().slice(0, 10),
            status: 'Shipment Booked',
            route,
            eta
          })
        });
        if (booking && booking._id) {
          await fetchJson(`/bookings/${booking._id}`, { method: 'PATCH', body: JSON.stringify({ trackingId: nextId }) });
        }
        created = true;
      } catch (err) {
        alert('Failed to create shipment. Please try again.');
      }
      if (!created) return;
      window.open('/admin/shipments', '_blank');
      location.href = '/admin/customers';
    }
  });
  tbody.addEventListener('change', async (e) => {
    const input = e.target.closest('input[data-action="eta"]');
    if (!input) return;
    const id = input.getAttribute('data-id');
    const eta = input.value.trim();
    if (!id) return;
    await fetchJson(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ eta }) });
  });
};

export const initLogout = () => {
  const btn = document.getElementById('logoutBtn');
  if (btn) { btn.addEventListener('click', logout); }
};

export const initMobileSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const openBtn = document.getElementById('openSidebar');
  const closeBtn = document.getElementById('closeSidebar');
  const open = () => { sidebar.classList.add('open'); overlay.classList.add('open'); };
  const close = () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); };
  if (openBtn) { openBtn.addEventListener('click', open); }
  if (closeBtn) { closeBtn.addEventListener('click', close); }
  if (overlay) { overlay.addEventListener('click', close); }
};

export const initAdminCommon = () => {
  requireAuth();
  initLogout();
  initMobileSidebar();
};

