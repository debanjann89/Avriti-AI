import { Sparkles, Heart, Shield, Cpu, Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F8] pb-24 font-sans overflow-x-hidden relative select-none">
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
            2px 2px 0px rgba(216, 27, 96, 0.08);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(216, 27, 96, 0.08);
          box-shadow: 0 20px 40px rgba(163, 13, 69, 0.03);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(216, 27, 96, 0.2);
          box-shadow: 0 30px 60px rgba(163, 13, 69, 0.08);
        }

        .profile-glow {
          box-shadow: 0 0 40px rgba(216, 27, 96, 0.15);
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-6deg); }
        }
        .animate-float-slow {
          animation: float-slow 7.5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 5.5s ease-in-out infinite;
        }
      `}} />

      {/* Soft Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-tr from-[#F8D7DA]/25 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-[#F8D7DA]/20 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      {/* Floating 3D Star Constellation */}
      <div className="absolute top-[8%] left-[8%] animate-float-slow z-5 text-[#D81B60]/35 pointer-events-none hidden sm:block">
        <svg className="w-5 h-5 fill-[#D81B60]" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>
      <div className="absolute bottom-[40%] left-[5%] animate-float-fast z-5 text-[#A30D45]/30 pointer-events-none hidden sm:block">
        <svg className="w-3.5 h-3.5 fill-[#A30D45]" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>
      <div className="absolute top-[15%] right-[10%] animate-float-slow z-5 text-[#D81B60]/40 pointer-events-none hidden sm:block">
        <svg className="w-4.5 h-4.5 fill-[#D81B60]" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>
      <div className="absolute bottom-[15%] right-[12%] animate-float-fast z-5 text-[#A30D45]/35 pointer-events-none hidden sm:block">
        <svg className="w-4 h-4 fill-[#A30D45]" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 pt-16 lg:pt-24">
        
        {/* ================= 1. Editorial Header Section ================= */}
        <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-28">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8D7DA] text-[#A30D45] font-extrabold text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/50 mb-6">
            <Sparkles className="w-3.5 h-3.5 fill-[#F8D7DA]" />
            <span>Behind The Atelier</span>
          </div>
          <h1 className="text-[54px] sm:text-[76px] lg:text-[90px] leading-[0.82] text-editorial-title uppercase font-jakarta select-none">
            About<br/>
            <span className="text-[#A30D45] font-display italic font-bold normal-case tracking-normal">Aavriti AI</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base lg:text-lg text-[#1E1E1E]/60 max-w-2xl mx-auto font-medium leading-relaxed font-sans">
            Blending time-honored Indian heritage weaves with cutting-edge neural rendering pipelines to democratize virtual outfit draping.
          </p>
        </div>

        {/* ================= 2. Motive & Vision Double Column ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-24 lg:mb-32">
          
          {/* Motive Card */}
          <div className="col-span-12 lg:col-span-6 glass-card rounded-[32px] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D81B60]/5 to-transparent rounded-bl-[100px] pointer-events-none" />
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#D81B60]/10 flex items-center justify-center text-[#D81B60]">
                <Heart className="w-6 h-6 fill-[#D81B60]/10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
                Our Motive
              </h2>
              <p className="text-[12.5px] sm:text-sm text-[#1E1E1E]/65 leading-relaxed font-sans font-medium">
                Traditional ethnic wear—the heavy silk borders of a Banarasi saree, the elaborate layers of a festive bridal lehenga, or the structured drape of a designer kurta—holds deep cultural resonance. Yet, shopping for these royal garments online has always suffered from visual friction. 
              </p>
              <p className="text-[12.5px] sm:text-sm text-[#1E1E1E]/65 leading-relaxed font-sans font-medium">
                We realized that static catalogs fail to convey how a saree's pleats settle or how a fabric fits individual body dimensions. **Aavriti AI** was born to solve this challenge. Our motive is to eliminate guesswork, empowering dress lovers to try on heritage ethnic garments instantly on their personal portraits before purchase.
              </p>
            </div>
            <div className="pt-6 border-t border-pink-100/35 mt-6 flex items-center justify-between">
              <span className="text-[9px] font-black text-[#D81B60]/40 font-jakarta uppercase tracking-widest">01 // TACTILE CONFIDENCE</span>
              <Sparkles className="w-4 h-4 text-[#D81B60]/30" />
            </div>
          </div>

          {/* Vision Card */}
          <div className="col-span-12 lg:col-span-6 glass-card rounded-[32px] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#A30D45]/5 to-transparent rounded-bl-[100px] pointer-events-none" />
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#A30D45]/10 flex items-center justify-center text-[#A30D45]">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
                Our Vision
              </h2>
              <p className="text-[12.5px] sm:text-sm text-[#1E1E1E]/65 leading-relaxed font-sans font-medium">
                We envision a future where high-fashion e-commerce is entirely experiential and highly customized. By fusing aesthetic artificial intelligence with physics-based fabric rendering, our vision is to democratize online couture fitting for ethnic wear global audiences.
              </p>
              <p className="text-[12.5px] sm:text-sm text-[#1E1E1E]/65 leading-relaxed font-sans font-medium">
                Through our highly specialized Aavriti AI Try-On engine, we are redefining traditional fashion retail. We aim to support weavers and boutique heritage brands by connecting their craftsmanship with digital visualization pipelines, making fine traditional apparel universally accessible, personal, and sustainable.
              </p>
            </div>
            <div className="pt-6 border-t border-pink-100/35 mt-6 flex items-center justify-between">
              <span className="text-[9px] font-black text-[#A30D45]/40 font-jakarta uppercase tracking-widest">02 // DIGITAL WEAVES</span>
              <Sparkles className="w-4 h-4 text-[#A30D45]/30" />
            </div>
          </div>

        </div>

        {/* ================= 3. The Founders Showcase Section ================= */}
        <div className="space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[9px] text-[#D81B60] font-black uppercase tracking-[0.25em] font-jakarta">The Architects</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight">
              Meet the Developers
            </h2>
            <div className="w-12 h-[2px] bg-[#D81B60]/40 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Developer 1: Debanjan Amin */}
            <div className="glass-card rounded-[36px] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group">
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
                  Debanjan leads the server infrastructure and core backend systems powering Aavriti. He designs high-performance server structures, secure RESTful endpoint matrices, robust user credential hashing databases, and gates our administrative portals.
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['FastAPI', 'Python', 'Uvicorn', 'REST APIs', 'SQL Database', 'Authentication'].map((tech) => (
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
            <div className="glass-card rounded-[36px] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group">
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
                  Banashree directs the UI/UX creative vision and interactive interfaces of Aavriti. She engineers immersive visual layers, responsive editorial campaign layouts, neomorphic card systems, active state routing capsules, and smooth CSS animations.
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['React.js', 'Vite.js', 'Tailwind CSS', 'UI/UX Design', 'CSS Keyframes', 'SVG Torus'].map((tech) => (
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

        {/* ================= 4. Bottom CTA ================= */}
        <div className="mt-20 lg:mt-28 text-center select-none">
          <h3 className="text-2xl font-black text-[#1E1E1E] uppercase font-jakarta tracking-tight mb-2">
            Ready to visualize your select fits?
          </h3>
          <p className="text-xs text-[#1E1E1E]/50 font-semibold tracking-wide mb-6">
            Drape sarees and lehengas virtually in under 5 seconds with our Aavriti Try-On system.
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
