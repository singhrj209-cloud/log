import { useEffect } from 'react';
import { initScrollAnimations, initSidebar } from '../utils/publicUi';

const styles = `

@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Sora:wght@500;700;800&display=swap');
    body{font-family:Manrope,sans-serif;overflow-x:hidden;background:radial-gradient(circle at 95% 0,#ecfeff 0,#f8fafc 45%,#eef2ff 100%);color:#0f172a}
    h1,h2,h3,h4,.logo{font-family:Sora,sans-serif}
    .animate-on-scroll{opacity:0;transform:translateY(26px);transition:.8s}.animate-visible{opacity:1;transform:none}
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
    .post{background:#fff;border:1px solid rgba(14,165,233,.3);transition:.35s;overflow:hidden}.post:hover{transform:translateY(-8px);box-shadow:0 20px 36px -24px rgba(14,165,233,.6)}
    .post img{height:200px;object-fit:cover;transition:.4s}.post:hover img{transform:scale(1.06)}
    .tag{background:#e0f2fe;color:#075985;border:1px solid #7dd3fc}
    .list-card{background:linear-gradient(160deg,#fff,#f8fafc);border:1px solid rgba(14,165,233,.35)}
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


  <section class='py-24'>
    <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div class='text-center mb-12 animate-on-scroll'><h2 class='text-4xl font-extrabold'>Latest Resources</h2><p class='text-slate-600 mt-3'>SEO-focused educational content for shippers and supply chain teams.</p></div>
      <div class='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
        <article class='post rounded-2xl animate-on-scroll'><img src='https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80' alt='Shipping tips' class='w-full'><div class='p-5'><span class='tag px-3 py-1 rounded-full text-xs font-bold'>Shipping Tips</span><h3 class='text-xl font-extrabold mt-3 mb-2'>7 Ways to Reduce Delivery Delays</h3><p class='text-slate-600 text-sm'>A tactical checklist for route planning, packaging prep, and pickup timing.</p></div></article>
        <article class='post rounded-2xl animate-on-scroll' style='transition-delay:.08s'><img src='https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=900&q=80' alt='Packaging' class='w-full'><div class='p-5'><span class='tag px-3 py-1 rounded-full text-xs font-bold'>Packaging Guidelines</span><h3 class='text-xl font-extrabold mt-3 mb-2'>How to Package Fragile Goods Properly</h3><p class='text-slate-600 text-sm'>Best practices for cushioning, labeling, and compliance-safe wrapping.</p></div></article>
        <article class='post rounded-2xl animate-on-scroll' style='transition-delay:.16s'><img src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80' alt='Industry news' class='w-full'><div class='p-5'><span class='tag px-3 py-1 rounded-full text-xs font-bold'>Logistics News</span><h3 class='text-xl font-extrabold mt-3 mb-2'>Freight Market Trends to Watch in 2026</h3><p class='text-slate-600 text-sm'>What changing fuel rates and lane demand mean for shipping costs.</p></div></article>
        <article class='post rounded-2xl animate-on-scroll'><img src='https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80' alt='Road freight compliance' class='w-full'><div class='p-5'><span class='tag px-3 py-1 rounded-full text-xs font-bold'>Road Compliance</span><h3 class='text-xl font-extrabold mt-3 mb-2'>Road Freight Rules Explained</h3><p class='text-slate-600 text-sm'>Understand safety checks, documentation, and delivery requirements for UK road transport.</p></div></article>
        <article class='post rounded-2xl animate-on-scroll' style='transition-delay:.08s'><img src='https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80' alt='Supply chain' class='w-full'><div class='p-5'><span class='tag px-3 py-1 rounded-full text-xs font-bold'>Supply Chain Insights</span><h3 class='text-xl font-extrabold mt-3 mb-2'>How to Build a Resilient Supply Chain</h3><p class='text-slate-600 text-sm'>Diversification, buffer planning, and proactive visibility strategies.</p></div></article>
        <article class='post rounded-2xl animate-on-scroll' style='transition-delay:.16s'><img src='https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80' alt='Compliance' class='w-full'><div class='p-5'><span class='tag px-3 py-1 rounded-full text-xs font-bold'>Compliance</span><h3 class='text-xl font-extrabold mt-3 mb-2'>Shipping Documents You Should Not Miss</h3><p class='text-slate-600 text-sm'>A practical documentation stack for domestic and cross-border deliveries.</p></div></article>
      </div>
    </div>
  </section>

  <section class='pb-24'><div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6'><div class='list-card rounded-2xl p-7 animate-on-scroll'><h3 class='text-2xl font-extrabold mb-4'>Popular Topics</h3><ul class='space-y-3 text-slate-600'><li><i class='fa-solid fa-angle-right text-sky-600 mr-2'></i>Route optimization strategies</li><li><i class='fa-solid fa-angle-right text-sky-600 mr-2'></i>Cost-effective packaging methods</li><li><i class='fa-solid fa-angle-right text-sky-600 mr-2'></i>How to read freight quotes</li><li><i class='fa-solid fa-angle-right text-sky-600 mr-2'></i>Tracking KPI metrics that matter</li></ul></div><div class='list-card rounded-2xl p-7 animate-on-scroll'><h3 class='text-2xl font-extrabold mb-4'>Why This Helps SEO</h3><p class='text-slate-600'>This resource hub targets common customer search intent around shipping tips, packaging rules, and delivery planning. Publishing consistently improves discoverability and trust.</p></div></div></section>

  <footer class='bg-slate-950 text-white pt-16 pb-8'><div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm'>&copy; 2026 SinghRj Transport. All rights reserved.</div></footer>
`;

export default function BlogResources() {
  useEffect(() => {
    const cleanups = [];
    cleanups.push(initScrollAnimations());
    cleanups.push(initSidebar());
    return () => { cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); }); };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}










