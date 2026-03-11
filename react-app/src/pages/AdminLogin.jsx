import { useEffect } from 'react';
import { initLogin } from '../utils/adminPanel';

const styles = `


@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    :root{--ink:#0f172a;--sky:#0ea5e9;--line:#e2e8f0;--shadow:0 24px 60px -40px rgba(15,23,42,.55)}
    body{font-family:'Plus Jakarta Sans',sans-serif;background:radial-gradient(circle at top left,#e0f2fe 0,#f8fafc 45%,#eef2ff 100%);color:var(--ink);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem}
    h1,h2,.brand{font-family:'Space Grotesk',sans-serif}
    .card{background:#fff;border:1px solid var(--line);border-radius:1.5rem;padding:2.5rem;box-shadow:var(--shadow);max-width:420px;width:100%}
    label{font-weight:600;font-size:.85rem;color:#334155}
    input{width:100%;border:1px solid var(--line);border-radius:.8rem;padding:.75rem .9rem;font-size:.95rem;background:#fff}
    .btn{display:inline-flex;align-items:center;gap:.5rem;background:linear-gradient(135deg,#0ea5e9,#22d3ee);color:white;padding:.9rem 1.4rem;border-radius:.9rem;font-weight:700;width:100%;justify-content:center}
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
<div class='card'>
    <div class='text-center mb-6'>
      <p class='brand text-2xl font-bold'>SinghRj Admin</p>
      <p class='text-xs uppercase tracking-[.3em] text-slate-400 mt-2'>Secure Login</p>
    </div>
    <form id='loginForm' class='grid gap-4'>
      <div>
        <label>Username</label>
        <input id='loginUser' type='text' placeholder='admin'>
      </div>
      <div>
        <label>Password</label>
        <input id='loginPass' type='password' placeholder='••••••••'>
      </div>
      <button class='btn'><i class='fa-solid fa-right-to-bracket'></i>Login</button>
    </form>
    <p class='text-xs text-slate-500 mt-4 text-center'>Demo mode: any username/password is accepted until backend is connected.</p>
  </div>
`;

export default function AdminLogin() {
  useEffect(() => {
    const cleanups = [];
    cleanups.push(initLogin());
    return () => { cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); }); };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}






