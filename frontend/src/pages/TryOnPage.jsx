import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TryOnStudio from '../components/TryOnStudio';
import { Sparkles, Sliders, Cpu, Award } from 'lucide-react';

export default function TryOnPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'buyer') {
      navigate('/profile?tab=become-seller');
    }
  }, [user, navigate]);

  if (!user || user.role === 'buyer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F8] pb-24 font-sans select-none">
      
      {/* 3D Glassmorphic Showcase Header */}
      <section className="relative w-full py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-[#FFF8F8] via-[#FFF8F8] to-[#FFF0F2] border-b border-pink-100/40">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#F8D7DA]/35 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#F8D7DA]/25 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Visual copy & statistics badge */}
            <div className="col-span-12 lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8D7DA] text-[#A30D45] font-extrabold text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/50">
                <Sparkles className="w-3.5 h-3.5 fill-[#F8D7DA] text-orange-500" />
                <span>Premium Seller Features Enabled</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-[#1E1E1E] leading-tight font-jakarta uppercase">
                Aavriti <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D81B60] via-[#A30D45] to-[#D81B60]">AI Try-On Studio</span>
              </h1>
              
              <p className="text-sm text-[#1E1E1E]/65 leading-relaxed font-sans font-medium max-w-xl mx-auto lg:mx-0">
                Welcome to your premier designer workshop. Utilize our state-of-the-art physics-guided neural solver to drape catalog items onto custom models, generate realistic catalog imagery, and publish products instantly to the store.
              </p>

              {/* Core Feature Stats Tray */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-pink-100/40 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Fast Rendering (&lt;3.5s)</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-pink-100/40 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#D81B60]" />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">High Fidelity (Ultra HD)</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-pink-100/40 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Physics Solver Enabled</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase Pipeline graphics */}
            <div className="col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Pipeline Step 1 */}
              <div className="p-6 rounded-2xl bg-white border border-pink-100/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-500/5 to-transparent rounded-bl-[40px] pointer-events-none" />
                <span className="text-[9px] font-black text-[#D81B60]/40 font-jakarta">PHASE 01</span>
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-[#D81B60] my-3">
                  <Sliders className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-black text-[#1E1E1E] uppercase font-jakarta">Texture Mapping</h4>
                <p className="text-[10px] text-[#1E1E1E]/55 leading-relaxed font-sans font-medium mt-1.5">
                  Gemini extracts thread weight, pattern borders, and silk texture indexes.
                </p>
              </div>

              {/* Pipeline Step 2 */}
              <div className="p-6 rounded-2xl bg-white border border-pink-100/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-500/5 to-transparent rounded-bl-[40px] pointer-events-none" />
                <span className="text-[9px] font-black text-[#D81B60]/40 font-jakarta">PHASE 02</span>
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-[#D81B60] my-3">
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-black text-[#1E1E1E] uppercase font-jakarta">Neural Solving</h4>
                <p className="text-[10px] text-[#1E1E1E]/55 leading-relaxed font-sans font-medium mt-1.5">
                  Drapes fabric contours realistically around model dimensions and shoulder lines.
                </p>
              </div>

              {/* Pipeline Step 3 */}
              <div className="p-6 rounded-2xl bg-white border border-pink-100/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-500/5 to-transparent rounded-bl-[40px] pointer-events-none" />
                <span className="text-[9px] font-black text-[#D81B60]/40 font-jakarta">PHASE 03</span>
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-[#D81B60] my-3">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-black text-[#1E1E1E] uppercase font-jakarta">Light Composition</h4>
                <p className="text-[10px] text-[#1E1E1E]/55 leading-relaxed font-sans font-medium mt-1.5">
                  Generates photorealistic ambient studio lights, body shadows and fits.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Interactive Try-On Studio Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-[32px] shadow-xl border border-pink-100/40 overflow-hidden">
          <TryOnStudio />
        </div>
      </div>

    </div>
  );
}
