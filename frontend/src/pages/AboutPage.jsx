import { Sparkles, Heart, Shield, Cpu, Code, ArrowRight, Leaf, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F8] pb-32 font-sans overflow-x-hidden relative select-none">
      {/* Premium Embedded Fonts and Typography Enhancements */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        
        .font-display {
          font-family: 'Playfair Display', serif;
        }

        .font-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .text-editorial-title {
          color: #1E1E1E;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.85;
          text-shadow: 
            1px 1px 0px #ffffff,
            3px 3px 0px rgba(216, 27, 96, 0.08);
        }

        .glass-card-lg {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(216, 27, 96, 0.08);
          box-shadow: 0 30px 60px rgba(163, 13, 69, 0.04);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-card-lg:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(216, 27, 96, 0.2);
          box-shadow: 0 45px 80px rgba(163, 13, 69, 0.1);
        }

        .logo-emblem {
          box-shadow: 
            0px 20px 45px rgba(216, 27, 96, 0.18),
            0px 4px 12px rgba(0, 0, 0, 0.03),
            inset 0px 2px 4px rgba(255, 255, 255, 0.4);
          border: 4px solid #ffffff;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .logo-emblem:hover {
          transform: rotate(3deg) scale(1.05);
          box-shadow: 
            0px 25px 50px rgba(216, 27, 96, 0.28),
            inset 0px 2px 4px rgba(255, 255, 255, 0.6);
        }

        .profile-glow {
          box-shadow: 0 0 35px rgba(216, 27, 96, 0.15);
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(4deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-5deg); }
        }
        .animate-float-slow {
          animation: float-slow 8.5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 6s ease-in-out infinite;
        }
      `}} />

      {/* Soft Ambient Background Glows */}
      <div className="absolute top-[-5%] left-[-10%] w-[900px] h-[900px] bg-gradient-to-tr from-[#F8D7DA]/25 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-br from-[#F8D7DA]/20 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-[45%] left-[20%] w-[700px] h-[700px] bg-[#D81B60]/3 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Organic Background Constellation (Organic background stars scattered randomly) */}
      <div className="absolute top-[6%] left-[10%] animate-float-slow z-5 text-[#D81B60]/35 pointer-events-none hidden sm:block">
        <svg className="w-5 h-5 fill-[#D81B60]" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>
      <div className="absolute bottom-[35%] left-[6%] animate-float-fast z-5 text-[#A30D45]/35 pointer-events-none hidden sm:block">
        <svg className="w-4 h-4 fill-[#A30D45]" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>
      <div className="absolute top-[18%] right-[8%] animate-float-slow z-5 text-[#D81B60]/40 pointer-events-none hidden sm:block">
        <svg className="w-5 h-5 fill-[#D81B60]" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>
      <div className="absolute bottom-[10%] right-[10%] animate-float-fast z-5 text-[#A30D45]/30 pointer-events-none hidden sm:block">
        <svg className="w-4.5 h-4.5 fill-[#A30D45]" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 relative z-10 pt-20 lg:pt-28">
        
        {/* ================= 1. Editorial Header Section with Logo Emblem ================= */}
        <div className="text-center max-w-4xl mx-auto mb-24 lg:mb-32">
          
          {/* Circular Luxury Logo Emblem */}
          <div className="flex justify-center mb-8">
            <div className="logo-emblem w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-white flex items-center justify-center cursor-pointer">
              <img 
                src="/Logo.jpg" 
                alt="Aavriti AI Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8D7DA] text-[#A30D45] font-extrabold text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/50 mb-6">
            <Sparkles className="w-3.5 h-3.5 fill-[#F8D7DA]" />
            <span>The Premium Fashion-Tech Atelier</span>
          </div>

          <h1 className="text-[58px] sm:text-[84px] lg:text-[104px] leading-[0.82] text-editorial-title uppercase font-jakarta select-none">
            About<br/>
            <span className="text-[#A30D45] font-display italic font-bold normal-case tracking-normal">Aavriti AI</span>
          </h1>
          <p className="mt-8 text-sm sm:text-base lg:text-lg text-[#1E1E1E]/60 max-w-2xl mx-auto font-medium leading-relaxed font-sans">
            Blending handloom Indian heritage weaves with advanced generative neural rendering solvers to reconstruct virtual outfit draping.
          </p>
        </div>

        {/* ================= 2. Motive & Vision (Widescreen Grand Grid) ================= */}
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-stretch mb-28 lg:mb-36">
          
          {/* Motive Card */}
          <div className="col-span-12 lg:col-span-6 glass-card-lg rounded-[36px] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#D81B60]/5 to-transparent rounded-bl-[140px] pointer-events-none" />
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#D81B60]/10 flex items-center justify-center text-[#D81B60]">
                <Heart className="w-7 h-7 fill-[#D81B60]/10" />
              </div>
              <h2 className="text-3xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
                Our Motive
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#1E1E1E]/65 leading-relaxed font-sans font-medium">
                <p>
                  Traditional ethnic garments—the thick, shimmering silk borders of a handloomed Banarasi saree, the elaborate layered panels of a bridal lehenga, or the meticulous geometry of an ethnic kurta—carry heavy cultural history. Yet, shopping for these royal garments online has historically been restricted by static, two-dimensional product catalogs.
                </p>
                <p>
                  We recognized that physical visualization is a key friction point. Static previews cannot convey how a heavy Georgette saree folds, how metallic zari borders catch studio light, or how distinct garments suit unique physical measurements.
                </p>
                <p>
                  **Aavriti AI** was conceptualized to resolve this friction. Our motive is to restore tactile confidence. By establishing real-time virtual fitting previews, we remove sizing anxiety and open a premium visual canvas for ethnic wear enthusiasts globally.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-pink-100/35 mt-8 flex items-center justify-between">
              <span className="text-[9.5px] font-black text-[#D81B60]/40 font-jakarta uppercase tracking-widest">01 // TACTILE EMPOWERMENT</span>
              <Sparkles className="w-4 h-4 text-[#D81B60]/30" />
            </div>
          </div>

          {/* Vision Card */}
          <div className="col-span-12 lg:col-span-6 glass-card-lg rounded-[36px] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#A30D45]/5 to-transparent rounded-bl-[140px] pointer-events-none" />
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#A30D45]/10 flex items-center justify-center text-[#A30D45]">
                <Cpu className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
                Our Vision
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#1E1E1E]/65 leading-relaxed font-sans font-medium">
                <p>
                  We envision a fashion environment where e-commerce is highly experiential, immersive, and custom-tailored to the individual. Our goal is to democratize online couture fitting for ethnic wear global audiences by integrating advanced machine learning pipelines directly into web interfaces.
                </p>
                <p>
                  By deploying our proprietary neural fabric solver, we are redefining modern apparel shopping. We seek to establish a virtual marketplace where local handloom artisans and high-fashion luxury boutiques can render their creations globally in under 5 seconds.
                </p>
                <p>
                  Our vision unifies traditional handwork with progressive web ecosystems. We strive to reduce purchase returns, establish logistics sustainability, and build personal relationships between fine craft and design lovers.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-pink-100/35 mt-8 flex items-center justify-between">
              <span className="text-[9.5px] font-black text-[#A30D45]/40 font-jakarta uppercase tracking-widest">02 // COUTURE PIPELINES</span>
              <Sparkles className="w-4 h-4 text-[#A30D45]/30" />
            </div>
          </div>

        </div>

        {/* ================= 3. The Core Pillars Section ================= */}
        <div className="mb-28 lg:mb-36">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 select-none">
            <span className="text-[9px] text-[#D81B60] font-black uppercase tracking-[0.25em] font-jakarta">Atelier Foundations</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
              Our Core Pillars
            </h2>
            <div className="w-12 h-[2px] bg-[#D81B60]/40 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="glass-card-lg rounded-[28px] p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-pink-100/30 flex items-center justify-center text-[#D81B60]">
                  <Star className="w-5 h-5 fill-[#D81B60]" />
                </div>
                <h3 className="text-lg font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
                  01 / Heritage Revival
                </h3>
                <p className="text-[11.5px] text-[#1E1E1E]/60 font-medium leading-relaxed font-sans">
                  We bridge the gap for traditional handloom weavers. By providing interactive digital draping channels, local Indian craftsman can showcase luxury fabrics to global customers.
                </p>
              </div>
              <span className="text-[8.5px] font-black text-[#D81B60]/50 font-jakarta uppercase tracking-widest">Craftsman Curation</span>
            </div>

            {/* Pillar 2 */}
            <div className="glass-card-lg rounded-[28px] p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-pink-100/30 flex items-center justify-center text-[#A30D45]">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
                  02 / Sustainable Draping
                </h3>
                <p className="text-[11.5px] text-[#1E1E1E]/60 font-medium leading-relaxed font-sans">
                  Virtual Try-On drastically reduces sizing returns by up to 60%. This decreases transport packaging waste and carbon footprint logistics, ensuring green e-commerce.
                </p>
              </div>
              <span className="text-[8.5px] font-black text-[#A30D45]/50 font-jakarta uppercase tracking-widest">Eco-Logistics Care</span>
            </div>

            {/* Pillar 3 */}
            <div className="glass-card-lg rounded-[28px] p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-pink-100/30 flex items-center justify-center text-[#D81B60]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
                  03 / Bespoke Accessibility
                </h3>
                <p className="text-[11.5px] text-[#1E1E1E]/60 font-medium leading-relaxed font-sans">
                  Custom profiles, interactive sizing databases, and real-time visualization filters ensure that bespoke, tailored styling is available to users of all shapes and styles.
                </p>
              </div>
              <span className="text-[8.5px] font-black text-[#D81B60]/50 font-jakarta uppercase tracking-widest">Tailored Inclusion</span>
            </div>

          </div>
        </div>

        {/* ================= 4. Deep Visual Tech Pipeline Section ================= */}
        <div className="glass-card-lg rounded-[40px] p-8 sm:p-12 mb-28 lg:mb-36 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#D81B60]/4 to-transparent rounded-bl-[200px] pointer-events-none" />
          
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D81B60]/10 text-[#D81B60] font-extrabold text-[9px] uppercase tracking-widest">
                <Cpu className="w-3.5 h-3.5" />
                <span>The Draping Pipeline</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight leading-none">
                High-Fidelity<br/>
                Fabric physics
              </h2>
              <p className="text-[12px] sm:text-xs text-[#1E1E1E]/60 leading-relaxed font-sans font-medium">
                Our Aavriti AI Try-On engine runs complex pixel-draping solvers. Unlike generic flat photo-overlays, the engine extracts density, fabric folds, and lighting vectors from a flat product photograph.
              </p>
              <p className="text-[12px] sm:text-xs text-[#1E1E1E]/60 leading-relaxed font-sans font-medium">
                The neural solver then projects these textures onto your uploaded portrait, rendering authentic wrinkles, shadows, and fabric weight folds around shoulders, waists, and borders.
              </p>
              <div className="flex items-center gap-4 text-[#D81B60] text-[10px] font-black uppercase tracking-wider font-jakarta pt-2">
                <span>Rendering Time: &lt; 3.5s</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D81B60]" />
                <span>Resolution: Ultra HD</span>
              </div>
            </div>

            {/* Visual Process Blocks */}
            <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Process Step 1 */}
              <div className="p-6 rounded-2xl bg-white/50 border border-pink-100/30 space-y-3">
                <span className="text-[10px] font-black text-[#D81B60]/40 font-jakarta">STEP 01</span>
                <h4 className="text-sm font-black text-[#1E1E1E] uppercase font-jakarta">Texture Parsing</h4>
                <p className="text-[10.5px] text-[#1E1E1E]/55 leading-relaxed font-sans font-medium">
                  Analyzes yarn density, embroidery weight, and silk prints.
                </p>
              </div>

              {/* Process Step 2 */}
              <div className="p-6 rounded-2xl bg-white/50 border border-pink-100/30 space-y-3">
                <span className="text-[10px] font-black text-[#D81B60]/40 font-jakarta">STEP 02</span>
                <h4 className="text-sm font-black text-[#1E1E1E] uppercase font-jakarta">Neural Solving</h4>
                <p className="text-[10.5px] text-[#1E1E1E]/55 leading-relaxed font-sans font-medium">
                  Calculates fabric physics onto user portrait landmarks.
                </p>
              </div>

              {/* Process Step 3 */}
              <div className="p-6 rounded-2xl bg-white/50 border border-pink-100/30 space-y-3">
                <span className="text-[10px] font-black text-[#D81B60]/40 font-jakarta">STEP 03</span>
                <h4 className="text-sm font-black text-[#1E1E1E] uppercase font-jakarta">Light Composition</h4>
                <p className="text-[10.5px] text-[#1E1E1E]/55 leading-relaxed font-sans font-medium">
                  Compiles shading vectors and ambient studio light halos.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ================= 5. The Founders Showcase Section ================= */}
        <div className="space-y-16 mb-28 lg:mb-36">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 select-none">
            <span className="text-[9px] text-[#D81B60] font-black uppercase tracking-[0.25em] font-jakarta">The Architects</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
              Meet the Developers
            </h2>
            <div className="w-12 h-[2px] bg-[#D81B60]/40 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            
            {/* Developer 1: Debanjan Amin */}
            <div className="glass-card-lg rounded-[36px] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-[100px] pointer-events-none" />
              
              <div className="space-y-6">
                {/* Profile Header Block */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D81B60] to-[#A30D45] flex items-center justify-center text-white font-display text-2xl font-bold profile-glow border-2 border-white select-none">
                    DA
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1E1E1E] uppercase tracking-tight font-jakarta">
                      Debanjan Amin
                    </h3>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-[#D81B60]/10 text-[#D81B60] font-bold text-[8.5px] uppercase tracking-wider">
                      <Shield className="w-3 h-3" />
                      <span>Backend Architect</span>
                    </span>
                  </div>
                </div>

                <p className="text-[12px] sm:text-xs text-[#1E1E1E]/60 leading-relaxed font-sans font-medium">
                  Debanjan leads the backend system infrastructure, rest gate validations, database schemas, and AI pipeline routing for Aavriti. He engineers robust FastAPI backbones, user credential hashing layers, and secure administrative gateways.
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['FastAPI', 'Python', 'Uvicorn', 'REST APIs', 'SQL Database', 'Authentication', 'API Pipelines', 'Encryption'].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md bg-[#FFF8F8] border border-pink-100/40 text-[9px] text-[#1E1E1E]/55 font-bold uppercase tracking-wide">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-pink-100/35 mt-6 flex items-center justify-between">
                <span className="text-[9px] font-black text-[#1E1E1E]/40 font-jakarta uppercase tracking-wider">Aavriti backend systems</span>
                <Cpu className="w-4 h-4 text-[#D81B60]/30" />
              </div>
            </div>

            {/* Developer 2: Banashree Das */}
            <div className="glass-card-lg rounded-[36px] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-[100px] pointer-events-none" />
              
              <div className="space-y-6">
                {/* Profile Header Block */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A30D45] to-[#D81B60] flex items-center justify-center text-white font-display text-2xl font-bold profile-glow border-2 border-white select-none">
                    BD
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1E1E1E] uppercase tracking-tight font-jakarta">
                      Banashree Das
                    </h3>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-[#A30D45]/10 text-[#A30D45] font-bold text-[8.5px] uppercase tracking-wider">
                      <Code className="w-3 h-3" />
                      <span>Frontend Visionary</span>
                    </span>
                  </div>
                </div>

                <p className="text-[12px] sm:text-xs text-[#1E1E1E]/60 leading-relaxed font-sans font-medium">
                  Banashree directs the UI/UX creative vision, interface animations, responsive layouts, and user interactions. She designs 3D Saturn SVG torus paths, Active Navbar chip indicators, neomorphic dashboard components, and interactive fit databases.
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['React.js', 'Vite.js', 'Tailwind CSS', 'UI/UX Design', 'CSS Keyframes', 'SVG Torus', 'Responsive Layout', 'Micro-Interactions'].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md bg-[#FFF8F8] border border-pink-100/40 text-[9px] text-[#1E1E1E]/55 font-bold uppercase tracking-wide">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-pink-100/35 mt-6 flex items-center justify-between">
                <span className="text-[9px] font-black text-[#1E1E1E]/40 font-jakarta uppercase tracking-wider">Aavriti design interfaces</span>
                <Code className="w-4 h-4 text-[#A30D45]/30" />
              </div>
            </div>

          </div>
        </div>

        {/* ================= 6. Bottom CTA ================= */}
        <div className="text-center select-none">
          <h3 className="text-2xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight mb-2">
            Ready to visualize your select fits?
          </h3>
          <p className="text-xs text-[#1E1E1E]/50 font-semibold tracking-wide mb-6">
            Drape sarees, lehengas, and ethnic wear virtually in under 5 seconds with Aavriti Try-On.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/try-on" 
              className="px-8 py-4.5 rounded-full font-extrabold text-xs uppercase tracking-widest text-white bg-[#D81B60] hover:bg-[#A30D45] transition-all shadow-md shadow-pink-200/50 flex items-center gap-2 transform active:scale-98 cursor-pointer"
            >
              <span>Explore Virtual Try-On</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
