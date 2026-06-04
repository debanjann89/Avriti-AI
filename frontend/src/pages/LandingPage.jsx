import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Activity, ChevronRight, Zap, Heart, X, Check, Server, Cpu, Database, Calendar, Compass } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Custom Scroll Reveal wrapper using Intersection Observer for beautiful scroll animations
function ScrollReveal({ children, className = "", delay = "0ms" }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay }}
      className={`transition-all duration-1000 ease-out transform ${
        isIntersecting 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-[0.99] pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  // Interactive mock model heights
  const [mockHeight, setMockHeight] = useState(170);
  const [mockWeight, setMockWeight] = useState(65);
  const [mockSize, setMockSize] = useState('Medium');
  const [popClass, setPopClass] = useState('');

  // Dynamically update simulated size recommendations
  useEffect(() => {
    if (mockHeight > 175 && mockWeight > 70) {
      setMockSize('Large');
    } else if (mockHeight < 165 && mockWeight < 55) {
      setMockSize('Small');
    } else {
      setMockSize('Medium');
    }
  }, [mockHeight, mockWeight]);

  // Trigger bounce micro-animation on size recommendation changes
  useEffect(() => {
    setPopClass('animate-sizePop');
    const timer = setTimeout(() => setPopClass(''), 400);
    return () => clearTimeout(timer);
  }, [mockSize]);

  return (
    <div className="min-h-screen gradient-moving text-slate-800 font-sans relative overflow-hidden select-none">
      
      {/* Premium Ambient Animations and Custom Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes floatBubble {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.25; }
          50% { transform: translateY(-40px) rotate(180deg); opacity: 0.45; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.25; }
        }
        @keyframes sizePop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes gradientBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes drawConnection {
          0%, 100% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 0; }
        }
        .gradient-moving {
          background: linear-gradient(-45deg, #FFFBFB, #FFF3F4, #FFEBEF, #FFFBFB);
          background-size: 400% 400%;
          animation: gradientBg 18s ease infinite;
        }
        .animate-pulseGlow {
          animation: pulseGlow 12s infinite ease-in-out;
        }
        .animate-floatBubble1 {
          animation: floatBubble 14s infinite ease-in-out;
        }
        .animate-floatBubble2 {
          animation: floatBubble 20s infinite ease-in-out;
        }
        .animate-sizePop {
          animation: sizePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .connection-line {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawConnection 6s infinite ease-in-out;
        }
        .gradient-border-hover:hover {
          border-color: transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(45deg, #D81B60, #AD1457, #E91E63) border-box;
        }
      `}} />

      {/* Floating Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[800px] h-[800px] bg-gradient-to-tr from-[#F8D7DA]/25 to-transparent rounded-full filter blur-3xl pointer-events-none animate-pulseGlow" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[800px] h-[800px] bg-gradient-to-bl from-[#FFF0F2]/30 to-transparent rounded-full filter blur-3xl pointer-events-none animate-pulseGlow" style={{ animationDelay: '3s' }} />

      {/* Interactive Micro Floating Particles */}
      <div className="absolute top-[20%] left-[8%] w-16 h-16 rounded-full bg-[#FFF0F2] border border-[#F8D7DA]/40 pointer-events-none animate-floatBubble1" />
      <div className="absolute top-[60%] right-[10%] w-24 h-24 rounded-full bg-[#F8D7DA]/20 border border-white/60 pointer-events-none animate-floatBubble2" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[30%] left-[12%] w-12 h-12 rounded-full bg-[#FFF0F2]/80 border border-[#F8D7DA]/25 pointer-events-none animate-floatBubble1" style={{ animationDelay: '4s' }} />

      {/* Header Bar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-10 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <img 
            src="/Logo.jpg" 
            alt="Aavriti AI Logo" 
            className="w-12 h-12 object-cover rounded-2xl border border-white shadow-md hover:rotate-12 transition-transform duration-500"
          />
          <span className="text-xl font-black font-jakarta tracking-tight bg-gradient-to-r from-[#D81B60] via-[#A30D45] to-[#D81B60] bg-clip-text text-transparent hover:scale-105 transition-transform">
            Aavriti AI
          </span>
        </div>
        <Link 
          to="/login"
          className="px-6 py-2.5 bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#D81B60] hover:text-white hover:bg-[#D81B60] hover:border-[#D81B60] transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center relative z-10 flex flex-col items-center space-y-8">
        <ScrollReveal className="flex flex-col items-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF0F2] border border-[#F8D7DA]/60 rounded-full text-[10px] font-black uppercase tracking-wider text-[#D81B60] shadow-sm shadow-pink-100/30 animate-subtleFloat">
            <Sparkles className="w-3.5 h-3.5 fill-[#D81B60]/20 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Interactive Virtual Try-On Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-jakarta text-slate-900 tracking-tight max-w-4xl leading-[1.08]">
            Making Fashion Visual &{' '}
            <span className="bg-gradient-to-r from-[#D81B60] via-[#C2185B] to-[#AD1457] bg-clip-text text-transparent">
              Tailored to You
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-500 font-medium max-w-2xl leading-relaxed">
            Forget guessing standard sizes. Customize model shapes, adjust sizes, and generate high-fidelity virtual garment previews instantly before placing orders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <Link
              to="/home"
              className="w-full sm:w-auto bg-gradient-to-r from-[#D81B60] via-[#C2185B] to-[#AD1457] hover:from-[#C2185B] hover:to-[#880E4F] text-white text-xs font-extrabold uppercase tracking-widest px-10 py-4 rounded-2xl shadow-lg shadow-pink-250/20 hover:shadow-[#D81B60]/30 transition-all hover:scale-[1.04] active:scale-[0.96] flex items-center justify-center gap-2.5 border border-[#D81B60]/20 font-jakarta"
            >
              <span>Explore Boutique</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white/80 backdrop-blur-md border border-gray-200/80 hover:border-pink-300 text-slate-700 hover:text-[#D81B60] text-xs font-extrabold uppercase tracking-widest px-10 py-4 rounded-2xl transition-all hover:scale-[1.04] active:scale-[0.96] flex items-center justify-center gap-2.5 shadow-sm"
            >
              <span>Merchant Sign-In</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 space-y-36 pb-20 relative z-10">
        
        {/* Project Introduction Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <ScrollReveal className="lg:col-span-7 space-y-6 text-left" delay="100ms">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F2] flex items-center justify-center text-[#D81B60] border border-[#F8D7DA] hover:rotate-6 transition-transform">
              <Server className="w-5 h-5 fill-[#D81B60]/10" />
            </div>
            
            <div className="space-y-3">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#D81B60] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#F8D7DA]/60">Platform Overview</span>
              <h2 className="text-3xl sm:text-4xl font-black font-jakarta text-slate-900 tracking-tight leading-[1.1]">
                Unified Generative Ecosystem
              </h2>
            </div>
            
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              **Aavriti AI** is a comprehensive, full-stack generative e-commerce framework designed to bridge the gap between static inventory and personalized fits. By integrating robust server backend processing with responsive user interface design, we make shopping dynamic.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
              {[
                { icon: Cpu, name: "FastAPI Routing", text: "Robust python controllers coordinating image tasks." },
                { icon: Database, name: "SQL Database", text: "Secure user storage, transactions, and reviews." },
                { icon: Sparkles, name: "Vite Client", text: "Fluid glassmorphic views built with React & Lucide." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/50 border border-white/60 p-5 rounded-2xl flex flex-col justify-between space-y-3 hover:border-pink-250 transition-colors group">
                  <div className="w-8 h-8 rounded-xl bg-white border border-gray-150 flex items-center justify-center text-[#D81B60] group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                    <item.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-black uppercase tracking-wide text-slate-800 leading-none">{item.name}</h5>
                    <p className="text-[10px] text-gray-450 font-semibold leading-normal">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Graphical Representation of Ecosystem Connection */}
          <ScrollReveal className="lg:col-span-5 relative" delay="250ms">
            <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-8 rounded-[36px] shadow-2xl relative flex flex-col items-center justify-center h-[340px] text-center overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-30">
                <Sparkles className="w-12 h-12 text-[#D81B60] animate-pulse" />
              </div>

              {/* Decorative System Map Nodes */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 256 256">
                  {/* Connection Lines with moving dash arrays */}
                  <path d="M128,40 L60,180" stroke="#F48FB1" strokeWidth="2.5" fill="none" className="connection-line" />
                  <path d="M128,40 L196,180" stroke="#F48FB1" strokeWidth="2.5" fill="none" className="connection-line" />
                  <path d="M60,180 L196,180" stroke="#F48FB1" strokeWidth="2.5" fill="none" className="connection-line" />
                </svg>

                {/* Node 1: AI Engines (Top) */}
                <div className="absolute top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-[#D81B60] to-[#AD1457] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer" title="AI Draping model">
                  <Cpu className="w-5 h-5" />
                </div>
                
                {/* Node 2: SQLite database (Bottom Left) */}
                <div className="absolute bottom-6 left-2 w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer" title="SQLite database">
                  <Database className="w-5 h-5" />
                </div>

                {/* Node 3: React Vite Interface (Bottom Right) */}
                <div className="absolute bottom-6 right-2 w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer" title="React Client UI">
                  <Sparkles className="w-5 h-5 fill-white/20" />
                </div>

                {/* Central Brand Emblem */}
                <div className="w-20 h-20 rounded-3xl bg-white border border-gray-150 flex items-center justify-center shadow-xl animate-subtleFloat select-none">
                  <img src="/Logo.jpg" className="w-14 h-14 object-cover rounded-xl" alt="Brand Logo" />
                </div>
              </div>

              <div className="text-[9px] font-black uppercase tracking-widest text-[#D81B60] mt-3">
                Full-Stack System Map
              </div>
            </div>
          </ScrollReveal>
        </section>
        
        {/* Core Concept: Interactive Fit Slider Demo */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Interactive Simulation Dashboard Mock Card */}
          <ScrollReveal className="relative" delay="100ms">
            <div className="bg-white/70 backdrop-blur-2xl border border-white/80 p-8 rounded-[36px] shadow-2xl space-y-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>

              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#D81B60] bg-[#FFF0F2] px-2 py-0.5 rounded border border-[#F8D7DA]/40">Interactive Sandbox Demo</span>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Interactive Avatar Tuning</h4>
              </div>

              {/* Display Area simulating generative avatar preview */}
              <div className="h-44 bg-gradient-to-tr from-pink-100/50 to-pink-50/20 border border-[#F8D7DA]/40 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:border-[#D81B60]/40 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 bg-cover bg-center select-none" style={{ backgroundImage: "url('/Logo.jpg')" }} />
                
                <div className="text-center space-y-2 relative z-10 px-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simulation Status</div>
                  <div className={`text-2xl font-black text-[#D81B60] tracking-wider uppercase inline-block ${popClass}`}>
                    Fitting: {mockSize}
                  </div>
                  <div className="block mt-1">
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full border border-gray-150 shadow-sm inline-block">
                      Avatar Dimensions: {mockHeight}cm | {mockWeight}kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Sliders mimicking UI controls */}
              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    <span>Avatar Height</span>
                    <span className="text-[#D81B60] font-extrabold">{mockHeight} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="150" 
                    max="195" 
                    value={mockHeight}
                    onChange={(e) => setMockHeight(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#D81B60] hover:accent-[#AD1457] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    <span>Avatar Weight</span>
                    <span className="text-[#D81B60] font-extrabold">{mockWeight} kg</span>
                  </div>
                  <input 
                    type="range" 
                    min="45" 
                    max="95" 
                    value={mockWeight}
                    onChange={(e) => setMockWeight(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#D81B60] hover:accent-[#AD1457] transition-all"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="space-y-6 text-left" delay="250ms">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F2] flex items-center justify-center text-[#D81B60] border border-[#F8D7DA] hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-[#D81B60]/10" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-jakarta text-slate-900 tracking-tight leading-[1.1]">
              Try On Clothes on Your Body Profile
            </h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              We connect design catalog visuals directly with neural garment draping. Change parameters dynamically inside your account profile to generate realistic simulations of how garments fit and flow.
            </p>
            <div className="space-y-4 pt-2">
              {[
                { title: "Personalized Profile Settings", text: "Configure height, weight, waist, and shoulder width." },
                { title: "Instant Generative Feedback", text: "Drapes catalog garments instantly over your custom digital avatar." },
                { title: "Confident Checkout", text: "Eliminate sizing doubts before ordering to secure a perfect fit." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-normal">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Business Mindset: The Transformation (Before vs After comparison) */}
        <section className="space-y-12">
          <ScrollReveal className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#D81B60] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#F8D7DA]/60">Why We Are Different</span>
            <h2 className="text-3xl font-black font-jakarta text-slate-900 tracking-tight">The Retail Transformation</h2>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Discover how Aavriti AI replaces legacy friction with a modern, delightful shopping journey.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Column A: Legacy Path (Old Way) */}
            <ScrollReveal className="bg-white/40 border border-gray-250/60 p-8 rounded-[28px] shadow-sm space-y-6 relative overflow-hidden group hover:bg-white/60 transition-all duration-300 hover:shadow-md" delay="100ms">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-150 flex items-center justify-center text-rose-500 shrink-0">
                  <X className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-rose-600 uppercase tracking-wide">Legacy Retail Friction</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Standard shopping path</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Standard size chart guesswork", desc: "Forced to rely on rigid, ambiguous letters (S/M/L) that fit differently across brands." },
                  { title: "Static, flat garment images", desc: "No way to see how fabrics stretch, drop, and look on your specific body dimensions." },
                  { title: "Excessive return loops", desc: "Frustrating delivery delays, package returns, and wasted resources on size swaps." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-left group">
                    <span className="text-xs text-rose-450 font-extrabold mt-0.5 shrink-0 transition-transform group-hover:scale-110">0{idx+1}.</span>
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">{item.title}</h5>
                      <p className="text-xs text-gray-500 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Column B: Aavriti AI (New Way) */}
            <ScrollReveal className="bg-white/80 border border-pink-250 p-8 rounded-[28px] shadow-lg shadow-pink-100/30 space-y-6 relative overflow-hidden group hover:border-[#D81B60] transition-all duration-300 hover:shadow-xl hover:-translate-y-1" delay="250ms">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-5 h-5 text-[#D81B60]/30 animate-pulse" />
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0F2] border border-[#F8D7DA] flex items-center justify-center text-[#D81B60] shrink-0">
                  <Heart className="w-5 h-5 fill-[#D81B60]/10 stroke-[2] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#D81B60] uppercase tracking-wide">The Aavriti Experience</h4>
                  <p className="text-[9px] text-gray-455 font-bold uppercase tracking-widest">Interactive shopping path</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Tailored sizing profiles", desc: "Save height, weight, and shoulder measurements once. Shop everything custom-scaled." },
                  { title: "Photorealistic garment try-on", desc: "Generate instant models wearing garments customized to your specific target shape." },
                  { title: "Delightful first-time fit", desc: "Unbox orders with confidence. Enjoy clothes that fit perfectly right out of the package." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-left group">
                    <span className="text-xs text-[#D81B60] font-black mt-0.5 shrink-0 transition-transform group-hover:scale-110">0{idx+1}.</span>
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">{item.title}</h5>
                      <p className="text-xs text-gray-500 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* Our Vision */}
        <section className="space-y-12">
          <ScrollReveal className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#D81B60] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#F8D7DA]/60">Our Core Vision</span>
            <h2 className="text-3xl font-black font-jakarta text-slate-900 tracking-tight">Designed for Better Retail</h2>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              We design software solutions to resolve core challenges in standard online apparel retailing.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Zero Waste retailing",
                desc: "Enable virtual product trial-runs, resulting in a dramatic reduction in returns and ecological footprint.",
                icon: Shield,
                glow: "from-emerald-500/10 to-transparent"
              },
              {
                title: "Universal Body Fit",
                desc: "Break boundaries of standard clothing size grids. Experience responsive modeling configured to individual human dimensions.",
                icon: Activity,
                glow: "from-pink-500/10 to-transparent"
              },
              {
                title: "Autonomous Studios",
                desc: "Remove the need for expensive physical apparel photography. Generate promotional model styling catalogs on-demand.",
                icon: Sparkles,
                glow: "from-indigo-500/10 to-transparent"
              }
            ].map((vision, idx) => (
              <ScrollReveal 
                key={idx} 
                delay={`${idx * 150}ms`}
                className="bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-[28px] shadow-lg relative overflow-hidden flex flex-col justify-between text-left space-y-6 group hover:border-[#D81B60]/30 transition-all hover:scale-[1.03] duration-300 hover:shadow-xl"
              >
                <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${vision.glow} filter blur-2xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="w-10 h-10 rounded-2xl bg-white/90 border border-gray-150 flex items-center justify-center text-[#D81B60] group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm relative z-10">
                  <vision.icon className="w-5 h-5" />
                </div>
                <div className="space-y-2 relative z-10">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">{vision.title}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{vision.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Timeline Roadmap Future Plans */}
        <section className="space-y-12">
          <ScrollReveal className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#D81B60] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#F8D7DA]/60">Platform Roadmap</span>
            <h2 className="text-3xl font-black font-jakarta text-slate-900 tracking-tight text-center">Continuous Trajectory</h2>
            <p className="text-xs text-gray-500 font-medium leading-relaxed text-center">
              Our ongoing steps for deploying interactive and creative AI apparel shopping integrations.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                phase: "Phase 1: Generative Try-on",
                status: "Completed",
                desc: "Dynamic rendering of clothing garments over client-configured profiles containing custom height, weight, and shoulder measurements.",
                time: "Q1 - Q2 2026",
                iconColor: "text-emerald-500 bg-emerald-50",
                badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-150",
                stepNum: "01"
              },
              {
                phase: "Phase 2: Live Video AR",
                status: "Active Dev",
                desc: "Overlaying garments onto live customer webcam feeds, adapting automatically to real-time physical motions and dynamic changes.",
                time: "Q3 - Q4 2026",
                iconColor: "text-[#D81B60] bg-pink-50",
                badgeColor: "bg-pink-50 text-[#D81B60] border-pink-100",
                stepNum: "02"
              },
              {
                phase: "Phase 3: Automated Studios",
                status: "Upcoming",
                desc: "Giving designers and boutique partners tools to design custom print coordinates and pattern drafts directly inside the admin suite using generative modeling.",
                time: "Q1 2027",
                iconColor: "text-indigo-500 bg-indigo-50",
                badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
                stepNum: "03"
              }
            ].map((step, idx) => (
              <ScrollReveal 
                key={idx} 
                delay={`${idx * 150}ms`}
                className="bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-[28px] shadow-lg relative overflow-hidden flex flex-col justify-between text-left space-y-6 group hover:scale-[1.03] duration-300 hover:shadow-xl"
              >
                {/* Background Giant Step Number */}
                <div className="absolute bottom-[-10px] right-2 text-8xl font-black text-slate-100/40 opacity-30 select-none group-hover:scale-110 group-hover:text-[#D81B60]/5 transition-all duration-500 font-jakarta pointer-events-none">
                  {step.stepNum}
                </div>

                <div className="space-y-4">
                  {/* Icon & Timeframe */}
                  <div className="flex justify-between items-center">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${step.iconColor} border border-gray-200/50 shadow-sm shrink-0`}>
                      {idx === 0 ? <Check className="w-5 h-5" /> : idx === 1 ? <Compass className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{step.time}</span>
                    </div>
                  </div>

                  {/* Title & Status */}
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{step.phase}</h3>
                      <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${step.badgeColor}`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Ending Page Outro Section */}
        <ScrollReveal className="relative z-10 py-4" delay="100ms">
          <div className="bg-gradient-to-r from-slate-900 via-[#700c3b] to-slate-900 text-white rounded-[40px] px-8 py-16 sm:py-20 text-center relative overflow-hidden shadow-2xl border border-pink-900/30">
            {/* Background glowing rings */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,27,96,0.15)_0,transparent_60%)] pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-8 relative z-10">
              <div className="w-16 h-16 mx-auto rounded-3xl overflow-hidden border-2 border-white/20 bg-white/10 flex items-center justify-center shadow-2xl animate-subtleFloat">
                <img src="/Logo.jpg" className="w-full h-full object-cover" alt="Emblem" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-5xl font-black font-jakarta tracking-tight leading-none uppercase">
                  Step Into the Future of Fit
                </h2>
                <p className="text-xs sm:text-sm text-pink-100/70 font-medium max-w-lg mx-auto leading-relaxed">
                  Join a new era of boutique shopping. Redefine sizes, browse dynamic collections, and experience garments draped specifically to your profile.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                <Link
                  to="/home"
                  className="w-full sm:w-auto bg-white text-[#D81B60] hover:bg-pink-50 text-xs font-extrabold uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-white font-jakarta"
                >
                  <span>Enter Boutique</span>
                  <ArrowRight className="w-4 h-4 text-[#D81B60]" />
                </Link>
                
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-transparent border border-white/30 text-white hover:bg-white/10 text-xs font-extrabold uppercase tracking-widest px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Partner Portal</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-white/10 max-w-sm mx-auto text-[10px] text-pink-200/50 uppercase tracking-widest font-black">
                Aavriti AI — Draping Technology, Made Personal.
              </div>
            </div>
          </div>
        </ScrollReveal>

      </main>

      {/* Footer bar */}
      <footer className="border-t border-[#D81B60]/10 bg-white/20 backdrop-blur-md relative z-10 py-6 font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span>&copy; 2026 Aavriti AI Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#D81B60] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D81B60] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
