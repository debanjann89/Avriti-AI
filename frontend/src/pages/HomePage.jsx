import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Sparkles, ArrowRight, Play, ChevronRight, Star, Heart } from 'lucide-react';

export default function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FFF8F8] pb-20 font-sans overflow-x-hidden relative">
      {/* Premium Embedded Fonts and Typography Enhancements */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        
        .font-display {
          font-family: 'Playfair Display', serif;
        }

        .font-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .text-3d-luxury {
          color: #1E1E1E;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 0.85;
          text-shadow: 
            1px 1px 0px #ffffff,
            2px 2px 0px rgba(216, 27, 96, 0.12),
            3px 3px 0px rgba(163, 13, 69, 0.06);
        }

        .depth-card {
          box-shadow: 
            0px 30px 60px rgba(163, 13, 69, 0.08),
            0px 4px 20px rgba(0, 0, 0, 0.02);
        }

        .btn-3d-primary {
          background: #D81B60;
          box-shadow: 
            0px 8px 20px rgba(216, 27, 96, 0.3),
            0px 2px 4px rgba(0, 0, 0, 0.1),
            inset 0px 2px 2px rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-3d-primary:hover {
          background: #A30D45;
          transform: translateY(-2px);
          box-shadow: 
            0px 12px 24px rgba(163, 13, 69, 0.4),
            0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .btn-3d-secondary {
          background: #FFFFFF;
          box-shadow: 
            0px 8px 16px rgba(0, 0, 0, 0.05),
            inset 0px 2px 2px rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(216, 27, 96, 0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-3d-secondary:hover {
          background: #FFF8F8;
          transform: translateY(-2px);
          box-shadow: 
            0px 10px 20px rgba(216, 27, 96, 0.08);
        }

        @keyframes float-saturn {
          0%, 100% { transform: translateY(0px) rotate(-15deg); }
          50% { transform: translateY(-15px) rotate(-13deg); }
        }
        @keyframes float-shape-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
        }
        @keyframes float-shape-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(15px) rotate(-12deg) scale(1.05); }
        }
        @keyframes float-sphere {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(10px); }
        }

        .animate-saturn {
          animation: float-saturn 7s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-shape-slow 8.5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-shape-fast 6.5s ease-in-out infinite;
        }
        .animate-float-sphere {
          animation: float-sphere 5.5s ease-in-out infinite;
        }
        
        @keyframes sheen-sweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .btn-sheen-sweep {
          position: relative;
          overflow: hidden;
        }
        .btn-sheen-sweep::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 55%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
        }
        .btn-sheen-sweep:hover::before {
          animation: sheen-sweep 1.3s infinite ease-in-out;
        }
      `}} />

      {/* ================= 1. Standalone Full-Width 3D Editorial Hero ================= */}
      <section className="relative w-full pt-6 pb-0 lg:pt-10 bg-[#FFF8F8] overflow-hidden select-none border-b border-pink-100/20">
        
        {/* Soft Background Accent Ambient Lighting */}
        <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#F8D7DA]/35 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-br from-[#F8D7DA]/25 to-transparent rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-12 gap-8 items-center">
            
            {/* --- LEFT COLUMN (45%) --- */}
            <div className="col-span-12 lg:col-span-5 space-y-8 text-center lg:text-left relative z-20 pb-8 lg:pb-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8D7DA] text-[#A30D45] font-extrabold text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/50">
                <Sparkles className="w-3.5 h-3.5 fill-[#F8D7DA]" />
                <span>Premium Editorial Edition</span>
              </div>

              {/* Massive Bold Uppercase Fashion-Editorial Typography (Plus Jakarta Sans to avoid squeezed wide Syne stretch) */}
              <div className="space-y-1">
                <h1 className="text-[64px] sm:text-[84px] lg:text-[96px] leading-[0.82] text-3d-luxury uppercase font-jakarta select-none">
                  Fashion<br/>Focused
                </h1>
                <p className="text-[10px] text-[#A30D45]/70 font-black tracking-widest uppercase pl-1.5 mt-3 font-jakarta">2026 Season Line</p>
              </div>

              {/* Subheading Offer info */}
              <div className="space-y-1.5 pl-1">
                <h3 className="text-3xl font-extrabold text-[#1E1E1E] font-display uppercase tracking-tight">25% OFF</h3>
                <p className="text-xs text-[#1E1E1E]/60 font-semibold tracking-wide">Our all-new premium collections</p>
              </div>

              {/* 3D Depth CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <Link 
                  to="/collections" 
                  className="w-full sm:w-auto px-10 py-4.5 rounded-full font-extrabold text-xs uppercase tracking-widest text-white btn-3d-primary btn-sheen-sweep flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link 
                  to="/try-on"
                  className="w-full sm:w-auto px-8 py-4.5 rounded-full font-extrabold text-xs uppercase tracking-widest text-[#1E1E1E] btn-3d-secondary flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-[#1E1E1E] stroke-none" />
                  <span>Watch Lookbook</span>
                </Link>
              </div>
            </div>

            {/* --- CENTER SECTION (35%): TRANSPARENT MODEL OVERLAPPING 3D SATURN RINGS & GEOMETRIC ELEMENTS --- */}
            {/* Height scaled up to 700px to accommodate a massive, zoomed-in model and rings layout */}
            <div className="col-span-12 lg:col-span-4 flex justify-center items-center relative py-12 lg:py-0 select-none h-[600px] lg:h-[700px] overflow-visible">
              
              {/* === 3D Geometric Layers Backdrop === */}
              {/* Central Luxury Backdrop Studio Glow Effect */}
              <div className="absolute w-[500px] h-[500px] bg-[#D81B60]/12 rounded-full filter blur-[100px] pointer-events-none animate-pulse z-0 translate-y-[65px]" />

              {/* 1. Large Pale pink circular platform disk */}
              <div className="absolute w-[460px] h-[460px] lg:w-[520px] lg:h-[520px] rounded-full bg-[#F8D7DA]/40 border-4 border-white shadow-xl animate-float-slow z-5 pointer-events-none translate-y-[65px]" />

              {/* 2. Overlapping angled Rose disc */}
              <div className="absolute w-[320px] h-[320px] lg:w-[380px] lg:h-[380px] rounded-full bg-gradient-to-tr from-[#D81B60]/20 to-[#A30D45]/30 shadow-lg translate-x-12 translate-y-[20px] lg:translate-y-[20px] animate-float-fast z-5 pointer-events-none" />

              {/* 3. Neomorphic Soft floating spheres */}
              <div className="absolute w-18 h-18 rounded-full bg-gradient-to-br from-white to-[#F8D7DA] shadow-md -translate-x-40 -translate-y-24 animate-float-sphere z-30 border border-white/50 pointer-events-none" />
              <div className="absolute w-11 h-11 rounded-full bg-gradient-to-tr from-[#D81B60]/10 to-[#F8D7DA] shadow-inner translate-x-32 -translate-y-32 animate-float-sphere z-30 border border-[#F8D7DA]/30 pointer-events-none" />

              {/* 4. Elegant 3D Sculptural Rings & Spheres */}
              <div className="absolute w-32 h-32 rounded-full border-2 border-[#D81B60]/30 -translate-y-28 translate-x-24 animate-float-slow z-5 pointer-events-none" />

              {/* === Backdrop Saturn 3D Ring (Layered behind transparent model) === */}
              {/* Translated down by translate-y-[25px] lg:translate-y-[65px] to sit exactly in the middle of her body/waist */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-saturn z-10 translate-y-[25px] lg:translate-y-[65px]">
                <svg className="w-[620px] h-[480px] lg:w-[680px] lg:h-[530px] overflow-visible" viewBox="0 0 400 400">
                  <linearGradient id="saturnBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9f1239" />
                    <stop offset="40%" stopColor="#D81B60" />
                    <stop offset="70%" stopColor="#F8D7DA" />
                    <stop offset="100%" stopColor="#A30D45" />
                  </linearGradient>
                  
                  {/* 1. Deep Back Shadow Base */}
                  <path 
                    d="M 40,200 A 160,50 0 0 1 360,200" 
                    fill="none" 
                    stroke="#6b0c22" 
                    strokeWidth="26" 
                    strokeLinecap="round" 
                    opacity="0.18"
                    transform="rotate(-15, 200, 200)"
                  />
                  
                  {/* 2. Main Glow Back Body */}
                  <path 
                    d="M 40,200 A 160,50 0 0 1 360,200" 
                    fill="none" 
                    stroke="url(#saturnBackGrad)" 
                    strokeWidth="22" 
                    strokeLinecap="round" 
                    transform="rotate(-15, 200, 200)"
                  />

                  {/* 3. Highlight Back Spine */}
                  <path 
                    d="M 40,200 A 160,50 0 0 1 360,200" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    opacity="0.45"
                    strokeDasharray="40 180"
                    transform="rotate(-15, 200, 200)"
                  />
                </svg>
              </div>

              {/* === TRANSPARENT EXPLICIT MODEL IMAGE (z-index: 20) === */}
              {/* Scale increased to 2.25x/2.5x so she occupies a massive, dominant screen space and anchors to floor */}
              <div className="relative z-20 h-[600px] lg:h-[670px] w-auto flex items-end justify-center select-none pointer-events-none overflow-visible">
                <img 
                  src="/media__1780342681756.png" 
                  alt="Aavriti Model" 
                  className="h-full w-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.18)] transform scale-[2.25] lg:scale-[2.5] translate-y-[25px] lg:translate-y-[65px]"
                />
              </div>

              {/* === Front Saturn 3D Ring (Layered in front of model for 3D wrap!) === */}
              {/* Translated down by translate-y-[25px] lg:translate-y-[65px] to sit exactly in the middle of her body/waist */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-saturn z-30 translate-y-[25px] lg:translate-y-[65px]">
                <svg className="w-[620px] h-[480px] lg:w-[680px] lg:h-[530px] overflow-visible filter drop-shadow-[0_18px_22px_rgba(163,13,69,0.35)]" viewBox="0 0 400 400">
                  <linearGradient id="saturnFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D81B60" />
                    <stop offset="50%" stopColor="#F8D7DA" />
                    <stop offset="100%" stopColor="#A30D45" />
                  </linearGradient>
                  
                  {/* 1. Deep Front Shadow Base */}
                  <path 
                    d="M 360,200 A 160,50 0 0 1 40,200" 
                    fill="none" 
                    stroke="#5c071a" 
                    strokeWidth="26" 
                    strokeLinecap="round" 
                    opacity="0.18"
                    transform="rotate(-15, 200, 200)"
                  />

                  {/* 2. Main Glow Front Body (Recreating claymorphic volume) */}
                  <path 
                    d="M 360,200 A 160,50 0 0 1 40,200" 
                    fill="none" 
                    stroke="url(#saturnFrontGrad)" 
                    strokeWidth="22" 
                    strokeLinecap="round" 
                    transform="rotate(-15, 200, 200)"
                  />

                  {/* 3. 3D Glossy Spine Highlight Reflection */}
                  <path 
                    d="M 360,200 A 160,50 0 0 1 40,200" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="4.5" 
                    strokeLinecap="round" 
                    opacity="0.65"
                    transform="rotate(-15, 200, 200)"
                  />
                </svg>
              </div>

              {/* 3D Star Sparkle accents floating in front of model */}
              <div className="absolute top-6 right-0 animate-float-fast z-30 text-[#D81B60] drop-shadow-md">
                <svg className="w-8 h-8 fill-[#D81B60]" viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
              </div>
              <div className="absolute top-24 left-4 animate-float-slow z-30 text-[#D81B60]/70 drop-shadow-sm">
                <svg className="w-4 h-4 fill-[#D81B60]" viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
              </div>
              <div className="absolute bottom-24 right-4 animate-float-fast z-30 text-[#D81B60]/80 drop-shadow-sm">
                <svg className="w-4.5 h-4.5 fill-[#D81B60]" viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
              </div>
              <div className="absolute bottom-10 left-0 animate-float-slow z-30 text-[#A30D45]/80 drop-shadow-sm">
                <svg className="w-5 h-5 fill-[#A30D45]" viewBox="0 0 24 24">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
              </div>
            </div>

            {/* --- RIGHT COLUMN (20%) --- */}
            <div className="col-span-12 lg:col-span-3 space-y-8 text-center lg:text-left relative z-20 pl-0 lg:pl-8 pb-8 lg:pb-0">
              
              {/* Explore Badge */}
              <div className="space-y-1.5 flex flex-col items-center lg:items-start">
                <p className="text-[10px] text-[#A30D45]/70 font-black tracking-widest uppercase">Explore New</p>
                <h4 className="text-xs font-black text-[#1E1E1E] uppercase tracking-widest flex items-center gap-1.5 font-jakarta">
                  <span>Arrival</span>
                  <span className="w-4 h-[2px] bg-[#1E1E1E] inline-block" />
                </h4>
              </div>

              {/* Man Collection Button */}
              <div className="flex justify-center lg:justify-start">
                <Link 
                  to="/collections" 
                  className="px-6 py-3 rounded-full bg-[#F8D7DA]/60 hover:bg-[#F8D7DA] text-[#A30D45] border border-pink-200/40 font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-2 transform hover:translate-x-1.5 transition-all shadow-sm"
                >
                  <span>Man Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A30D45]" />
                </Link>
              </div>

              {/* Minimal Fashion Statement Block */}
              <div className="space-y-4 pt-2">
                <p className="text-xs text-[#1E1E1E]/70 font-semibold leading-relaxed max-w-sm mx-auto lg:mx-0 font-sans">
                  "Fashion is a form of self-expression and individuality."
                </p>
                <Link 
                  to="/about"
                  className="inline-flex items-center gap-1 text-[9px] font-black text-[#D81B60] hover:text-[#A30D45] uppercase tracking-widest border-b-2 border-[#D81B60]/30 pb-0.5 transition-colors cursor-pointer"
                >
                  <span>Read More</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. THE CURATED CATALOG Highlights ================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 gap-4">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8D7DA] text-[#A30D45] font-extrabold text-[9px] uppercase tracking-widest mb-2">
              <Heart className="w-3 h-3 fill-[#D81B60] text-[#D81B60]" />
              <span>Curated Festive Looks</span>
            </div>
            <h2 className="text-3xl font-black text-[#1E1E1E] font-display tracking-tight leading-none mt-1">Festive Catalog Highlights</h2>
            <p className="mt-2 text-xs text-[#1E1E1E]/50 font-semibold tracking-wide">Explore high-quality traditional sarees, lehengas, and ethnic options.</p>
          </div>
          <Link 
            to="/collections" 
            className="text-[10px] font-black text-[#D81B60] hover:text-[#A30D45] uppercase tracking-widest border-b-2 border-[#D81B60]/20 pb-0.5 flex items-center gap-1 transition-all"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
        
        {/* Responsive Catalog Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
