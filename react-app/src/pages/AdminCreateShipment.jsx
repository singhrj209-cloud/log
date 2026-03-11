import { useEffect } from 'react';
import { initAdminCommon, initCreateShipment } from '../utils/adminPanel';

const styles = `


@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    :root{--ink:#0f172a;--sky:#0ea5e9;--line:#e2e8f0;--shadow:0 18px 40px -30px rgba(15,23,42,.45)}
    body{font-family:'Plus Jakarta Sans',sans-serif;background:radial-gradient(circle at top left,#e0f2fe 0,#f8fafc 45%,#eef2ff 100%);color:var(--ink);min-height:100vh}
    h1,h2,h3,h4,.brand{font-family:'Space Grotesk',sans-serif}
    .app-shell{display:grid;grid-template-columns:280px 1fr;min-height:100vh}
    .sidebar{background:linear-gradient(180deg,#0f172a 0,#0b1f3a 60%,#0b2b4f 100%);color:#e2e8f0;padding:2rem 1.5rem;position:sticky;top:0;height:100vh}
    .nav-item{display:flex;align-items:center;gap:.8rem;padding:.7rem 1rem;border-radius:.8rem;color:#e2e8f0;font-weight:600;font-size:.95rem;transition:.2s}
    .nav-item:hover{background:rgba(14,165,233,.15);color:#7dd3fc}
    .nav-active{background:rgba(14,165,233,.2);color:#bae6fd;box-shadow:inset 0 0 0 1px rgba(125,211,252,.3)}
    .card{background:#fff;border:1px solid var(--line);border-radius:1.25rem;padding:1.5rem;box-shadow:var(--shadow)}
    label{font-weight:600;font-size:.85rem;color:#334155}
    input,select,textarea{width:100%;border:1px solid var(--line);border-radius:.8rem;padding:.7rem .9rem;font-size:.9rem;background:#fff}
    .btn{display:inline-flex;align-items:center;gap:.5rem;background:linear-gradient(135deg,#0ea5e9,#22d3ee);color:white;padding:.85rem 1.4rem;border-radius:.8rem;font-weight:700}
    .btn.secondary{background:#0f172a}
    .topbar{display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between}
    .mobile-toggle{display:none}
    @media (max-width:1024px){
      .app-shell{grid-template-columns:1fr}
      .sidebar{position:fixed;left:0;top:0;transform:translateX(-100%);transition:.3s;z-index:50;width:260px}
      .sidebar.open{transform:translateX(0)}
      .overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);opacity:0;pointer-events:none;transition:.3s;z-index:40}
      .overlay.open{opacity:1;pointer-events:auto}
      .mobile-toggle{display:inline-flex}
    }
      /* mobile tweaks */
    .table-wrap{overflow-x:auto}
    table{min-width:720px}
    @media (max-width:640px){
      .card{padding:1.1rem}
      .topbar{align-items:flex-start}
      .topbar .search{width:100%;min-width:0}
      .topbar .search input{min-width:0}
      .topbar .flex.items-center.gap-4{flex-wrap:wrap}
      .topbar .flex.items-center.gap-3{flex-wrap:wrap}
    }

    
    

`;

const markup = `
<div class='overlay' id='overlay'></div>
  <div class='app-shell'>
    <aside class='sidebar' id='sidebar'>
      <div class='flex items-center justify-between mb-10'>
        <div>
          <p class='brand text-xl font-bold text-white'>SinghRj Admin</p>
          <p class='text-xs uppercase tracking-[.3em] text-sky-300 mt-1'>Control Panel</p>
        </div>
        <button class='mobile-toggle text-slate-200' id='closeSidebar'><i class='fa-solid fa-xmark text-lg'></i></button>
      </div>
      <nav class='space-y-2'>
        <a class='nav-item' href='/admin/dashboard'><i class='fa-solid fa-chart-line'></i>Dashboard</a>
        <a class='nav-item nav-active' href='/admin/create-shipment'><i class='fa-solid fa-box'></i>Create Shipment</a>
        <a class='nav-item' href='/admin/shipments'><i class='fa-solid fa-list-check'></i>Shipment List</a>
        <a class='nav-item' href='/admin/pricing'><i class='fa-solid fa-tags'></i>Pricing Plan</a>
        <a class='nav-item' href='/admin/bookings'><i class='fa-solid fa-file-signature'></i>Bookings</a>
        <a class='nav-item' href='/admin/customers'><i class='fa-solid fa-user-group'></i>Customer Details</a>
      </nav>
      <button id='logoutBtn' class='mt-8 w-full text-left text-sm font-semibold text-slate-200 hover:text-white border border-slate-700/60 rounded-xl px-4 py-3'>Logout</button>
    </aside>

    <main class='px-6 py-8 lg:px-10'>
      <div class='topbar mb-8'>
        <div class='flex items-center gap-3'>
          <button class='mobile-toggle text-slate-700 border border-slate-200 rounded-lg px-3 py-2' id='openSidebar'><i class='fa-solid fa-bars'></i></button>
          <div>
            <p class='text-sm uppercase tracking-[.3em] text-slate-400'>Create Shipment</p>
            <h1 class='text-3xl font-bold'>Add Tracking Details</h1>
          </div>
        </div>
        <div class='flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200'>
          <i class='fa-solid fa-box text-sky-500'></i>
          <p class='text-sm font-semibold'>Tracking ID will auto-generate</p>
        </div>
      </div>

      <section class='card'>
        <h2 class='text-xl font-bold mb-6'>Shipment Form</h2>
        <form id='createShipmentForm' class='grid lg:grid-cols-2 gap-5'>
          <div>
            <label>Tracking ID</label>
            <input id='trackingId' type='text' placeholder='HBC007' value='HBC007'>
          </div>
          <div>
            <label>Phone Number</label>
            <input id='phoneNumber' type='tel' placeholder='+91 98765 43210'>
          </div>
          <div>
            <label>Sender Name</label>
            <input id='senderName' type='text' placeholder='Ravi Kumar'>
          </div>
          <div>
            <label>Receiver Name</label>
            <input id='receiverName' type='text' placeholder='John Ahmed'>
          </div>
          <div>
            <label>Sender Address</label>
            <textarea id='senderAddress' rows='3' placeholder='Chennai, Tamil Nadu'></textarea>
          </div>
          <div>
            <label>Receiver Address</label>
            <textarea id='receiverAddress' rows='3' placeholder='Trichy, Tamil Nadu'></textarea>
          </div>
          <div>
            <label>Weight</label>
            <input id='weight' type='text' placeholder='12 kg'>
          </div>
          <div>
            <label>Shipment Type</label>
            <select id='shipmentType'>
              <option>Air</option>
              <option selected>Road</option>
              <option>Sea</option>
            </select>
          </div>
          <div>
            <label>Pickup Date</label>
            <input id='pickupDate' type='date' value='2026-03-10'>
          </div>
          <div>
            <label>Status</label>
            <select id='shipmentStatus'>
              <option>Shipment Booked</option>
              <option selected>Picked Up</option>
              <option>In Transit</option>
            </select>
          </div>
          <div class='flex flex-wrap gap-4 mt-6'>
            <button class='btn' type='submit'><i class='fa-solid fa-plus'></i>Create Shipment</button>
            <button class='btn secondary' type='button'><i class='fa-solid fa-floppy-disk'></i>Save Draft</button>
          </div>
        </form>
      </section>
    </main>
  </div>
`;

export default function AdminCreateShipment() {
  useEffect(() => {
    const cleanups = [];
    cleanups.push(initAdminCommon());
    cleanups.push(initCreateShipment());
    return () => { cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); }); };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}






