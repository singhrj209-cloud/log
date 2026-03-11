import { useEffect } from 'react';
import { initScrollAnimations, initSidebar, initFaq } from '../utils/publicUi';

const styles = `

@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Sora:wght@500;700;800&display=swap');
    body{font-family:Manrope,sans-serif;overflow-x:hidden;background:radial-gradient(circle at 95% 0,#ecfeff 0,#f8fafc 45%,#eef2ff 100%);color:#0f172a}
    h1,h2,h3,h4,.logo{font-family:Sora,sans-serif}
    .animate-on-scroll{opacity:0;transform:translateY(24px);transition:.8s}.animate-visible{opacity:1;transform:none}
    .topbar{background:#0b1a2b;color:#cbd5e1;border-bottom:1px solid rgba(148,163,184,.2)}.nav-wrap{background:rgba(7,18,35,.86);border:1px solid rgba(148,163,184,.22);backdrop-filter:blur(10px)}
    .mobile-menu{max-height:0;overflow:hidden;opacity:0;transition:.35s}.mobile-menu.open{max-height:320px;opacity:1}
    .sidebar{position:fixed;top:0;left:0;height:100vh;width:280px;background:#0b1328;color:#e2e8f0;transform:translateX(-100%);transition:.35s;z-index:60;box-shadow:20px 0 50px -30px rgba(2,6,23,.8)}
    .sidebar.open{transform:translateX(0)}
    .sidebar-overlay{position:fixed;inset:0;background:rgba(2,6,23,.55);opacity:0;pointer-events:none;transition:.35s;z-index:55}
    .sidebar-overlay.open{opacity:1;pointer-events:auto}
    .sidebar a{display:block;padding:.8rem 1.25rem;border-radius:.4rem;color:#e2e8f0}
    .sidebar a:hover{background:rgba(56,189,248,.12);color:#7dd3fc}
    .sidebar-title{letter-spacing:.2em;color:#7dd3fc}
    .hero{position:relative;height:100vh;min-height:100vh;overflow:hidden;isolation:isolate;padding-top:10rem}.hero::after{content:'';position:absolute;inset:0;background:linear-gradient(95deg,rgba(4,13,29,.9),rgba(4,13,29,.72));z-index:-1}
    .hero-slider{position:absolute;inset:0;z-index:-2}.hero-slide{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transform:scale(1.07);animation:heroFade 12s infinite}
    .hero-slide:nth-child(1){background-image:url('image/hero1.png');animation-delay:0s}
    .hero-slide:nth-child(2){background-image:url('image/hero2.png');animation-delay:4s}
    .hero-slide:nth-child(3){background-image:url('image/hero3.png');animation-delay:8s}
    @keyframes heroFade{0%{opacity:0;transform:scale(1.06)}8%,33%{opacity:1;transform:scale(1.01)}36%,100%{opacity:0;transform:scale(1.06)}}
    .hero-cut{position:absolute;left:0;right:0;bottom:-1px;height:82px;clip-path:polygon(0 60%,100% 0,100% 100%,0 100%);background:#0284c7}
    .faq{background:#fff;border:1px solid rgba(14,165,233,.3);border-radius:1rem;overflow:hidden;transition:.3s}.faq:hover{box-shadow:0 16px 30px -24px rgba(14,165,233,.6)}
    .faq-q{padding:1rem 1.2rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-weight:700;background:linear-gradient(120deg,#fff,#f8fafc)}
    .faq-a{max-height:0;overflow:hidden;transition:.35s;padding:0 1.2rem;color:#64748b}.faq.open .faq-a{max-height:240px;padding:0 1.2rem 1rem}
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


  <section class='py-24'><div class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4'>
    <div class='faq animate-on-scroll'><button class='faq-q'>How long does delivery take?<i class='fa-solid fa-plus text-sky-600'></i></button><div class='faq-a'><p>Domestic standard delivery typically takes 2-3 business days. Express deliveries are usually completed in 24-48 hours depending on route and pickup cut-off time.</p></div></div>
    <div class='faq animate-on-scroll'><button class='faq-q'>Can I track my shipment?<i class='fa-solid fa-plus text-sky-600'></i></button><div class='faq-a'><p>Yes. You can track shipment milestones and ETA from the Shipment Tracking page using your tracking ID.</p></div></div>
    <div class='faq animate-on-scroll'><button class='faq-q'>Do you offer insurance?<i class='fa-solid fa-plus text-sky-600'></i></button><div class='faq-a'><p>Insurance options are available for eligible shipments. Coverage terms depend on cargo category, declared value, and route.</p></div></div>
    <div class='faq animate-on-scroll'><button class='faq-q'>What items cannot be shipped?<i class='fa-solid fa-plus text-sky-600'></i></button><div class='faq-a'><p>Restricted items include hazardous materials without proper documentation, illegal goods, and prohibited cross-border items under destination regulations.</p></div></div>
    <div class='faq animate-on-scroll'><button class='faq-q'>What are your delivery hours?<i class='fa-solid fa-plus text-sky-600'></i></button><div class='faq-a'><p>Operations run Monday to Saturday with support for special delivery windows. Business support hours are 8:00 AM to 8:00 PM local time.</p></div></div>
  </div></section>

  <footer class='bg-slate-950 text-white pt-16 pb-8'><div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm'>&copy; 2026 SinghRj Transport. All rights reserved.</div></footer>
`;

export default function Faq() {
  useEffect(() => {
    const cleanups = [];
    cleanups.push(initScrollAnimations());
    cleanups.push(initSidebar());
    cleanups.push(initFaq());
    return () => { cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); }); };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}










