import { useEffect } from 'react';
import { initScrollAnimations, initTestimonialsTrack, initSidebar, initGetQuote } from '../utils/publicUi';

const styles = `

@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Sora:wght@500;700;800&display=swap');
    body{font-family:Manrope,sans-serif;overflow-x:hidden;background:radial-gradient(circle at 95% 0,#ecfeff 0,#f8fafc 45%,#eef2ff 100%);color:#0f172a;line-height:1.55;letter-spacing:.01em}
    h1,h2,h3,h4,.logo{font-family:Sora,sans-serif}
    .glass-nav{background:transparent}
    .animate-on-scroll{opacity:0;transform:translateY(28px) scale(.98);transition:.8s}
    .animate-visible{opacity:1;transform:translateY(0) scale(1)}
    .mobile-menu{max-height:0;overflow:hidden;opacity:0;transition:.35s}
    .mobile-menu.open{max-height:320px;opacity:1}
    .sidebar{position:fixed;top:0;left:0;height:100vh;width:280px;background:#0b1328;color:#e2e8f0;transform:translateX(-100%);transition:.35s;z-index:60;box-shadow:20px 0 50px -30px rgba(2,6,23,.8)}
    .sidebar.open{transform:translateX(0)}
    .sidebar-overlay{position:fixed;inset:0;background:rgba(2,6,23,.55);opacity:0;pointer-events:none;transition:.35s;z-index:55}
    .sidebar-overlay.open{opacity:1;pointer-events:auto}
    .sidebar a{display:block;padding:.8rem 1.25rem;border-radius:.4rem;color:#e2e8f0}
    .sidebar a:hover{background:rgba(56,189,248,.12);color:#7dd3fc}
    .sidebar-title{letter-spacing:.2em;color:#7dd3fc}
    .topbar{background:#0b1a2b;color:#cbd5e1;border-bottom:1px solid rgba(148,163,184,.2)}
    .nav-wrap{background:rgba(7,18,35,.86);border:1px solid rgba(148,163,184,.22);backdrop-filter:blur(10px)}

    .hero{position:relative;height:100vh;min-height:100vh;overflow:hidden;isolation:isolate;padding-top:10rem}
    .hero::after{content:'';position:absolute;inset:0;background:linear-gradient(95deg,rgba(4,13,29,.9) 0%,rgba(4,13,29,.77) 55%,rgba(4,13,29,.35) 100%);z-index:-1}
    .hero-slider{position:absolute;inset:0;z-index:-2}
    .hero-slide{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transform:scale(1.07);animation:heroFade 12s infinite}
    .hero-slide:nth-child(1){background-image:url('image/hero1.png');animation-delay:0s}
    .hero-slide:nth-child(2){background-image:url('image/hero2.png');animation-delay:4s}
    .hero-slide:nth-child(3){background-image:url('image/hero3.png');animation-delay:8s}
    @keyframes heroFade{0%{opacity:0;transform:scale(1.06)}8%,33%{opacity:1;transform:scale(1.01)}36%,100%{opacity:0;transform:scale(1.06)}}
    .hero-cut{position:absolute;left:0;right:0;bottom:-1px;height:86px;clip-path:polygon(0 60%,100% 0,100% 100%,0 100%);background:#0284c7}
    .hero-badge{color:#38bdf8;letter-spacing:.18em;font-size:.72rem;font-weight:800;text-transform:uppercase}

    .form-shell{background:#fff;border:1px solid rgba(14,165,233,.42);box-shadow:0 30px 60px -42px rgba(15,23,42,.45)}
    .form-panel{background:linear-gradient(160deg,#f8fafc,#f0f9ff);border:1px solid rgba(14,165,233,.25)}
    .input{width:100%;border:1px solid #cbd5e1;border-radius:.85rem;padding:.8rem .95rem;background:#fff;transition:.25s}
    .input:focus{outline:none;border-color:#0ea5e9;box-shadow:0 0 0 3px rgba(14,165,233,.18)}
    .label{font-size:.74rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#64748b;margin-bottom:.42rem;display:block}
    .pill{border:1px solid #bae6fd;background:#f0f9ff;border-radius:.8rem;padding:.7rem .85rem;font-size:.88rem;font-weight:700;color:#075985}
    .price-card{background:linear-gradient(140deg,#0f172a,#0c4a6e 55%,#0284c7);color:#fff;position:relative;overflow:hidden}
    .price-card::before{content:'';position:absolute;width:280px;height:280px;border-radius:999px;right:-90px;top:-90px;background:radial-gradient(circle,rgba(125,211,252,.55),rgba(125,211,252,0))}
    .btn-quote{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;transition:.35s}
    .btn-quote:hover{transform:translateY(-3px);box-shadow:0 14px 30px -16px rgba(14,165,233,.7)}

    .service-chip{background:#fff;border:1px solid rgba(14,165,233,.35);transition:.3s}
    .service-chip.active{background:linear-gradient(130deg,#0ea5e9,#06b6d4);color:#fff;border-color:#0284c7;box-shadow:0 10px 22px -16px rgba(14,165,233,.8)}

    .test-wrap{overflow:hidden}
    .test-track{display:flex;gap:1rem;width:max-content;animation:slideLeft 26s linear infinite}
    .test-wrap:hover .test-track{animation-play-state:paused}
    @keyframes slideLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .test-card{width:min(84vw,340px);background:#fff;border:1px solid #e2e8f0;box-shadow:0 20px 35px -28px rgba(15,23,42,.55)}
    .avatar{width:54px;height:54px;object-fit:cover;border-radius:999px;border:2px solid #0ea5e9}
    @media (max-width:1024px){.hero{height:100vh;min-height:100vh;padding-top:8.7rem}.hero::after{background:linear-gradient(180deg,rgba(4,13,29,.88),rgba(4,13,29,.74))}.hero-cut{height:62px}}
    @media (max-width:768px){.hero{height:60vh;min-height:60vh;padding-top:3rem}.hero-copy{text-align:center}.hero-copy .hero-badge{display:block;text-align:center}.hero-copy h1,.hero-copy p{margin-inline:auto}.hero-actions{justify-content:center}.process-shell:before{display:none}.test-track{animation-duration:20s}.quote-box{max-width:360px;margin-inline:auto}}

`;

const markup = `
<header class="fixed w-full z-50 glass-nav">
    <div class="topbar">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 hidden md:flex items-center justify-between text-[11px] tracking-wide">
        <p><i class="fa-solid fa-location-dot text-sky-500 mr-2"></i>60 Applecroft road, Luton (LU2 8BD)</p>
        <div class="flex items-center gap-5">
          <a href="tel:+447438282122" class="hover:text-white"><i class="fa-solid fa-phone text-sky-500 mr-2"></i>+44 7438 282122</a>
          <a href="mailto:info@singhrjtransport.com" class="hover:text-white"><i class="fa-solid fa-envelope text-sky-500 mr-2"></i>info@singhrjtransport.com</a>
        </div>
      </div>
    </div>
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
      <div class="nav-wrap rounded-md px-4 md:px-5 py-3 flex justify-between items-center relative flex-nowrap">
        <a href="/" class="logo text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 whitespace-nowrap"><i class="fas fa-plane-departure text-sky-500"></i>SINGHRJ <span class="text-slate-200">TRANSPORT</span></a>
        <div class="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-[.16em] text-slate-100 whitespace-nowrap">
          <a href="/" class="hover:text-sky-400">Home</a>
          <a href="/about" class="hover:text-sky-400">About</a>
          <a href="/services" class="hover:text-sky-400">Service</a>
          <a href="/get-quote" class="hover:text-sky-400">Book Now</a>
          <a href="/blog-resources" class="hover:text-sky-400">Blog</a>
          <a href="/faq" class="hover:text-sky-400">FAQ</a>
          <a href="/pricing-plans" class="hover:text-sky-400">Pricing Plan</a>
          <a href="/contact" class="hover:text-sky-400">Contact</a>
          <a href="/shipment-tracking" class="hover:text-sky-400">Tracking</a>
        </div>
        <div class="flex items-center gap-3">
          <button id="sidebar-btn" class="text-white text-lg border border-slate-600/60 rounded-md px-3 py-2 hover:border-sky-400" aria-label="Open Sidebar"><i class="fas fa-bars-staggered"></i></button>
        </div>
      </div>
    </nav>
  </header>

  <!-- SIDEBAR START -->
  <div id="sidebar-overlay" class="sidebar-overlay"></div>
  <aside id="sidebar" class="sidebar">
    <div class="flex items-center justify-between px-5 py-5 border-b border-slate-700/60">
      <span class="sidebar-title text-xs font-bold uppercase">Quick Menu</span>
      <button id="sidebar-close" class="text-slate-300 hover:text-white" aria-label="Close Sidebar"><i class="fas fa-times"></i></button>
    </div>
    <nav class="px-4 py-4 space-y-1 text-sm font-semibold">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/services">Service</a>
      <a href="/get-quote">Book Now</a>
      <a href="/blog-resources">Blog</a>
      <a href="/faq">FAQ</a>
      <a href="/pricing-plans">Pricing Plan</a>
      <a href="/contact">Contact</a>
      <a href="/shipment-tracking">Tracking</a>
    </nav>
  </aside>
  <!-- SIDEBAR END -->

  

  

  

  <section class="hero flex items-center">
    <div class="hero-slider"><div class="hero-slide"></div><div class="hero-slide"></div><div class="hero-slide"></div></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="grid md:grid-cols-[1fr_1.2fr] lg:grid-cols-[1fr_1.8fr] gap-8 items-center">
        <div class="hero-copy text-white">
          <span class="hero-badge mb-3 inline-block">We Specialize In The Transportation</span>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-[1.08] tracking-tight max-w-xl">Focused on aviation and energy.</h1>
          <p class="text-base sm:text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">We move heavy and critical cargo with speed, safety, and reliable scheduling across regional and global routes.</p>
          <div class="hero-actions flex flex-wrap gap-4">
            <a href="#services" class="hero-cta text-white px-6 py-3 rounded-sm font-bold text-sm">View Services</a>
            <a href="#contact" class="hero-ghost text-white px-6 py-3 rounded-sm font-bold text-sm transition">Talk to Expert</a>
          </div>
        </div>
        <div class="relative mt-6 lg:mt-0 hidden md:block">
          <img src="image/truck.png" alt="Truck" class="hero-truck w-full max-w-none mx-auto lg:ml-auto">
          <div class="absolute -bottom-3 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-2 bg-white text-slate-900 px-4 py-2 text-[10px] sm:text-xs font-bold rounded-sm shadow-lg hidden sm:block">FAST TRANSPORT SERVICE AGENCY</div>
        </div>
      </div>
    </div>
    <div class="hero-cut"></div>
  </section>


  <section id='quote-form' class='py-24'>
    <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div class='text-center mb-12 animate-on-scroll'>
        <h2 class='text-4xl font-extrabold'>Get a Quote</h2>
        <p class='text-slate-600 mt-3'>Fill out shipment information to generate an estimated price instantly.</p>
      </div>

      <div class='form-shell rounded-3xl p-6 sm:p-10 animate-on-scroll'>
        <div class='grid lg:grid-cols-3 gap-8'>
          <form id='quoteForm' class='lg:col-span-2 grid sm:grid-cols-2 gap-5'>
            <div>
              <label class='label'>Pickup Location</label>
              <input id='pickup' class='input' type='text' placeholder='City or postcode' required>
            </div>
            <div>
              <label class='label'>Delivery Location</label>
              <input id='delivery' class='input' type='text' placeholder='City or postcode' required>
            </div>
            <div>
              <label class='label'>Package Weight (kg)</label>
              <input id='weight' class='input' type='number' min='1' value='25' required>
            </div>
            <div>
              <label class='label'>Package Type</label>
              <select id='packageType' class='input'>
                <option value='document'>Document</option>
                <option value='box' selected>Box</option>
                <option value='pallet'>Pallet</option>
                <option value='fragile'>Fragile Goods</option>
              </select>
            </div>

            <div class='sm:col-span-2'>
              <label class='label'>Delivery Type</label>
              <div class='grid grid-cols-2 gap-3'>
                <button type='button' class='service-chip active rounded-xl p-3 font-bold' data-delivery='standard'>Standard</button>
                <button type='button' class='service-chip rounded-xl p-3 font-bold' data-delivery='express'>Express</button>
              </div>
              <input type='hidden' id='deliveryType' value='standard'>
            </div>

            <div>
              <label class='label'>Full Name</label>
              <input id='name' class='input' type='text' placeholder='Your name' required>
            </div>
            <div>
              <label class='label'>Phone Number</label>
              <input id='phone' class='input' type='tel' placeholder='+44 ...' required>
            </div>
            <div class='sm:col-span-2'>
              <label class='label'>Email Address</label>
              <input id='email' class='input' type='email' placeholder='name@company.com' required>
            </div>

            <div class='sm:col-span-2 mt-2'>
              <button type='submit' class='btn-quote w-full rounded-xl py-4 font-bold text-lg'>Submit Quote Request</button>
            </div>
          </form>

          <aside class='form-panel rounded-2xl p-5 sm:p-6'>
            <div class='price-card rounded-2xl p-6 mb-5'>
              <p class='text-xs uppercase tracking-[.2em] text-cyan-200 font-bold mb-2 relative z-10'>Instant Estimate</p>
              <p class='text-4xl font-extrabold relative z-10' id='priceOutput'>GBP 74.00</p>
              <p class='text-sm text-cyan-100 mt-2 relative z-10' id='etaOutput'>Estimated transit: 2-3 business days</p>
            </div>
            <div class='grid gap-3'>
              <div class='pill'>Pickup: <span id='pickupOut'>Not set</span></div>
              <div class='pill'>Delivery: <span id='deliveryOut'>Not set</span></div>
              <div class='pill'>Weight: <span id='weightOut'>25 kg</span></div>
              <div class='pill'>Service: <span id='serviceOut'>Standard</span></div>
            </div>
            <p class='text-xs text-slate-500 mt-4'>Estimate is indicative and subject to route conditions, customs requirements, and cargo handling needs.</p>
          </aside>
        </div>
      </div>
    </div>
  </section>

  <section class='py-24 bg-white'>
    <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div class='text-center mb-12 animate-on-scroll'><h2 class='text-4xl font-extrabold'>What Our Clients Say</h2><p class='text-slate-600 mt-3'>Horizontal sliding testimonials with client images.</p></div>
      <div class='test-wrap'>
        <div class='test-track pb-4' id='testimonials-track'>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"modern fleet friendly drivers five stars"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">ER</div><div><p class="font-bold">Elite Reviews</p><p class="text-xs text-slate-500">Local Guide - 155 reviews - 993 photos - a month ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Loaders/fork lift drivers were brilliant and nice guys. Office staff were good except for an Eastern European lady who has a serious attitude problem and so rude"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">MA</div><div><p class="font-bold">Martin Aiken</p><p class="text-xs text-slate-500">Local Guide - 116 reviews - 5 months ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Very quick unloading and friendly Warehouse staff 5 star service."</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">OP</div><div><p class="font-bold">Oleksandr Panasiuk</p><p class="text-xs text-slate-500">1 review - 2 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Very quick unloading and friendly Warehouse staff 5 star service"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">NL</div><div><p class="font-bold">nathan lawson</p><p class="text-xs text-slate-500">Local Guide - 10 reviews - 6 photos - 2 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Verey road warehouse is brilliant lovely staff very kind and helpful quick service!!! Thank you"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">JH</div><div><p class="font-bold">Jay Hal</p><p class="text-xs text-slate-500">2 reviews - 6 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Slow reaction from staff.makes you think you are invisible."</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">FD</div><div><p class="font-bold">Florin D</p><p class="text-xs text-slate-500">Local Guide - 202 reviews - 309 photos - 6 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"NOT TO BAD OF A COMPANY"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">CH</div><div><p class="font-bold">CHOOK</p><p class="text-xs text-slate-500">Local Guide - 72 reviews - 42 photos - edited 6 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"The best transport company in the world"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">BM</div><div><p class="font-bold">Ben Machado</p><p class="text-xs text-slate-500">2 reviews - 6 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"It's a bit dated"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">MB</div><div><p class="font-bold">martyn broughton</p><p class="text-xs text-slate-500">Local Guide - 292 reviews - 94 photos - 3 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Fast and Nice."</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">CH</div><div><p class="font-bold">Costin Hemes</p><p class="text-xs text-slate-500">Local Guide - 12 reviews - 21 photos - 5 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Easy to deal with"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">DL</div><div><p class="font-bold">dennis lownds</p><p class="text-xs text-slate-500">Local Guide - 153 reviews - 121 photos - 5 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Excellent"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">CP</div><div><p class="font-bold">Cornel Pavalache</p><p class="text-xs text-slate-500">Local Guide - 86 reviews - 14 photos - 6 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Crap"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">MP</div><div><p class="font-bold">Matt Porter</p><p class="text-xs text-slate-500">Local Guide - 440 reviews - 5 photos - 9 years ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Great company, you have to enter from the back from the street, very long waiting time even if you have a booking"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">DB</div><div><p class="font-bold">Daniel Buzner</p><p class="text-xs text-slate-500">Local Guide - 27 reviews - 7 photos - 6 months ago</p></div></div></article>
          <article class="test-card rounded-2xl p-6"><p class="italic text-slate-600 mb-4">"Fast unloading, good team"</p><div class="flex items-center gap-3"><div class="avatar bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">NP</div><div><p class="font-bold">Nihad Pido</p><p class="text-xs text-slate-500">Local Guide - 118 reviews - 178 photos - 3 years ago</p></div></div></article>
        </div>
      </div>
    </div>
  </section>

  <footer class='bg-slate-950 text-white pt-20 pb-10'>
    <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div class='grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
        <div><h2 class='text-2xl font-bold mb-6'>SINGHRJ <span class='text-cyan-400'>TRANSPORT</span></h2><p class='text-slate-400 text-sm leading-relaxed mb-6'>Reliable logistics with transparent execution and measurable service quality.</p></div>
        <div><h4 class='text-lg font-bold mb-6 border-b border-slate-800 pb-2'>Quick Links</h4><ul class='space-y-4 text-slate-400'><li><a href='/'>Home</a></li><li><a href='/about'>About</a></li><li><a href='/services'>Services</a></li><li><a href='/get-quote'>Quote</a></li></ul></div>
        <div><h4 class='text-lg font-bold mb-6 border-b border-slate-800 pb-2'>Quote Inputs</h4><ul class='space-y-4 text-slate-400'><li>Pickup & Delivery</li><li>Weight & Package Type</li><li>Standard or Express</li><li>Contact Details</li></ul></div>
        <div><h4 class='text-lg font-bold mb-6 border-b border-slate-800 pb-2'>Contact</h4><ul class='space-y-4 text-slate-400'><li>+44 7438 282122</li><li>info@singhrjtransport.com</li><li>Luton, UK</li></ul></div>
      </div>
      <div class='border-t border-slate-800 pt-8 text-center text-slate-500 text-sm'><p>&copy; 2026 SinghRj Transport. All rights reserved.</p></div>
    </div>
  </footer>
`;

export default function GetQuote() {
  useEffect(() => {
    const cleanups = [];
    cleanups.push(initScrollAnimations());
    cleanups.push(initTestimonialsTrack());
    cleanups.push(initSidebar());
    cleanups.push(initGetQuote());
    return () => { cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); }); };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}










