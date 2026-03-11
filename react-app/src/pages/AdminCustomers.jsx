import { useEffect } from 'react';
import { initAdminCommon, initCustomers } from '../utils/adminPanel';

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
    .table-wrap{border:1px solid var(--line);border-radius:1rem;overflow:hidden;background:#fff}
    table{width:100%;border-collapse:collapse}
    th,td{padding:.9rem 1rem;text-align:left;font-size:.9rem}
    th{background:#f1f5f9;font-weight:700;color:#475569}
    tr:nth-child(even){background:#f8fafc}
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
        <a class='nav-item' href='/admin/create-shipment'><i class='fa-solid fa-box'></i>Create Shipment</a>
        <a class='nav-item' href='/admin/shipments'><i class='fa-solid fa-list-check'></i>Shipment List</a>
        <a class='nav-item' href='/admin/pricing'><i class='fa-solid fa-tags'></i>Pricing Plan</a>
        <a class='nav-item' href='/admin/bookings'><i class='fa-solid fa-file-signature'></i>Bookings</a>
        <a class='nav-item nav-active' href='/admin/customers'><i class='fa-solid fa-user-group'></i>Customer Details</a>
      </nav>
      <button id='logoutBtn' class='mt-8 w-full text-left text-sm font-semibold text-slate-200 hover:text-white border border-slate-700/60 rounded-xl px-4 py-3'>Logout</button>
    </aside>

    <main class='px-6 py-8 lg:px-10'>
      <div class='topbar mb-8'>
        <div class='flex items-center gap-3'>
          <button class='mobile-toggle text-slate-700 border border-slate-200 rounded-lg px-3 py-2' id='openSidebar'><i class='fa-solid fa-bars'></i></button>
          <div>
            <p class='text-sm uppercase tracking-[.3em] text-slate-400'>Customer Details</p>
            <h1 class='text-3xl font-bold'>Customer Information</h1>
          </div>
        </div>
        <div class='flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200'>
          <i class='fa-solid fa-user-check text-sky-500'></i>
          <p class='text-sm font-semibold'>Bookings from Get Quote</p>
        </div>
      </div>

      <section class='card'>
          <div class='flex items-center justify-between mb-4'>
            <div>
              <h2 class='text-xl font-bold'>Latest 7 Bookings</h2>
              <p class='text-sm text-slate-500'>Auto-filled from get-quote.html backend.</p>
            </div>
            <span class='text-xs px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-semibold' id='customerCount'>0 Records</span>
          </div>
          <div class='table-wrap'>
            <table>
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody id='customersBody'>
                <tr>
                  <td>HBC001</td>
                  <td>Arun</td>
                  <td>+91 98765 12012</td>
                  <td>arun@gmail.com</td>
                  <td>Chennai</td>
                </tr>
                <tr>
                  <td>HBC002</td>
                  <td>Devi</td>
                  <td>+91 98765 88910</td>
                  <td>devi@gmail.com</td>
                  <td>Trichy</td>
                </tr>
                <tr>
                  <td>HBC003</td>
                  <td>John</td>
                  <td>+91 90234 99001</td>
                  <td>john@gmail.com</td>
                  <td>Madurai</td>
                </tr>
                <tr>
                  <td>HBC004</td>
                  <td>Priya</td>
                  <td>+91 98989 22345</td>
                  <td>priya@gmail.com</td>
                  <td>Salem</td>
                </tr>
                <tr>
                  <td>HBC005</td>
                  <td>Ahmed</td>
                  <td>+91 98444 22001</td>
                  <td>ahmed@gmail.com</td>
                  <td>Erode</td>
                </tr>
                <tr>
                  <td>HBC006</td>
                  <td>Kumar</td>
                  <td>+91 98888 88345</td>
                  <td>kumar@gmail.com</td>
                  <td>Vellore</td>
                </tr>
                <tr>
                  <td>HBC007</td>
                  <td>Meera</td>
                  <td>+91 99444 77441</td>
                  <td>meera@gmail.com</td>
                  <td>Coimbatore</td>
                </tr>
              </tbody>
            </table>
          </div>
      </section>
    </main>
  </div>
`;

export default function AdminCustomers() {
  useEffect(() => {
    const cleanups = [];
    cleanups.push(initAdminCommon());
    cleanups.push(initCustomers());
    return () => { cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); }); };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}






