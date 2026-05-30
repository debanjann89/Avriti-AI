import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { 
  Sparkles, ArrowRight, Play, Search, ShoppingBag, 
  ChevronRight, Star, Heart, CheckCircle2, User, 
  Sliders, MapPin, LogOut, ChevronDown 
} from 'lucide-react';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';

export default function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);
  const { user, logout } = useContext(AuthContext);
  const { toggleCart, cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Categories metadata with luxury avatars
  const categories = [
    { 
      name: "Women", 
      count: "120+", 
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80" 
    },
    { 
      name: "Men", 
      count: "100+", 
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
    },
    { 
      name: "Kids", 
      count: "70+", 
      img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=150&q=80" 
    },
    { 
      name: "Jackets", 
      count: "28+", 
      img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=150&q=80" 
    },
    { 
      name: "Swimwear", 
      count: "70+", 
      img: "https://images.unsplash.com/photo-1576430171212-61ee0e20686f?auto=format&fit=crop&w=150&q=80" 
    }
  ];

  return (
    <div className="min-h-screen bg-[#edd8d8] py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden relative flex flex-col justify-between">
      {/* Dynamic Embedded Styles for Premium 3D Effects and Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Syne:wght@800&display=swap');
        
        .font-display {
          font-family: 'Playfair Display', serif;
        }
        
        .text-3d-fashion {
          color: #701a2d; /* Custom dark deep red */
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.04em;
          text-shadow: 
            1px 1px 0px #ffffff,
            2px 2px 0px #eadecc,
            3px 3px 0px #d8c6b7,
            4px 4px 15px rgba(112, 26, 45, 0.22);
        }
        
        .clay-tablet {
          background: #fcf4f2;
          border: 12px solid #ffffff;
          box-shadow: 
            0px 35px 70px -15px rgba(115, 80, 80, 0.35),
            inset 0px -4px 12px rgba(115, 80, 80, 0.04),
            inset 0px 4px 12px rgba(255, 255, 255, 0.95);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .neomorphic-dock {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 
            0px 15px 40px rgba(115, 80, 80, 0.08),
            inset 0px 2px 4px rgba(255, 255, 255, 0.95);
        }

        .category-pill {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .category-pill:hover {
          transform: translateY(-6px) scale(1.025);
          box-shadow: 0 12px 20px -8px rgba(112, 26, 45, 0.15);
        }
        
        @keyframes float-saturn {
          0%, 100% { transform: translateY(0px) rotate(-15deg); }
          50% { transform: translateY(-12px) rotate(-13deg); }
        }
        
        @keyframes float-star-1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.15); }
        }
        
        @keyframes float-star-2 {
          0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
          50% { transform: translateY(10px) scale(0.9) rotate(45deg); }
        }

        .animate-saturn {
          animation: float-saturn 6.5s ease-in-out infinite;
        }

        .animate-star-1 {
          animation: float-star-1 4.5s ease-in-out infinite;
        }

        .animate-star-2 {
          animation: float-star-2 5.5s ease-in-out infinite;
        }
      `}} />

      {/* ================= MAIN LUXURY TABLET FRAME CONTAINER ================= */}
      <div className="max-w-7xl mx-auto w-full clay-tablet rounded-[48px] p-6 sm:p-10 relative overflow-hidden flex-grow flex flex-col justify-between">
        
        {/* Soft Background Accent Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-rose-200/20 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />

        {/* ================= 1. THE INTEGRATED Standalone HEADER ================= */}
        <header className="flex justify-between items-center pb-6 border-b border-pink-100/50 relative z-30">
          
          {/* Brand Logo Group */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 transform group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="leading-tight">
              <h2 className="text-xl font-display font-black text-pink-950 tracking-tight leading-none">Aavriti AI</h2>
              <span className="text-[9px] text-pink-700 font-extrabold uppercase tracking-widest leading-none mt-1 block">Indian Fashion Reimagined</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 pl-6">
            <Link to="/collections" className="text-pink-950/70 hover:text-pink-700 font-extrabold text-xs uppercase tracking-widest transition-colors">Collections</Link>
            <Link to="/collections" className="text-pink-950/70 hover:text-pink-700 font-extrabold text-xs uppercase tracking-widest transition-colors">Categories</Link>
            <Link to="/try-on" className="text-pink-700 hover:text-pink-800 font-extrabold text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5">
              <span>AI Stylist</span>
              <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            </Link>
            <Link to="/about" className="text-pink-950/70 hover:text-pink-700 font-extrabold text-xs uppercase tracking-widest transition-colors">About Us</Link>
          </nav>

          {/* Header Action Buttons & Dynamic Dropdown */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/collections')}
              className="w-10 h-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-pink-950 shadow-sm border border-pink-100/50 hover:scale-105 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
            
            {/* Cart Trigger */}
            <button 
              onClick={toggleCart} 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 hover:scale-105 transition-all relative"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-pink-700 text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-pink-200 shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown or Login Icon */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="w-10 h-10 rounded-full border border-pink-200 overflow-hidden bg-white shadow-sm flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-4.5 w-4.5 text-pink-600" />
                  )}
                </button>

                {/* Dropdown Card */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-white border border-pink-100 rounded-2xl shadow-xl py-2.5 z-50 animate-fadeIn text-left">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1.5">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Signed in as</p>
                      <p className="text-xs font-black text-slate-800 truncate mt-0.5">{user.name}</p>
                    </div>
                    
                    <Link 
                      to="/profile?tab=profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-pink-50/30 hover:text-pink-600 transition-colors"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Profile & Sizing</span>
                    </Link>
                    
                    <Link 
                      to="/profile?tab=addresses" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-pink-50/30 hover:text-pink-600 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Saved Addresses</span>
                    </Link>
                    
                    <Link 
                      to="/profile?tab=orders" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-pink-50/30 hover:text-pink-600 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order History</span>
                    </Link>
                    
                    <hr className="border-gray-100 my-1.5" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout Account</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="w-10 h-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-pink-950 shadow-sm border border-pink-100/50 hover:scale-105 transition-all"
              >
                <User className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* ================= 2. THE MAIN HERO BODY GRID ================= */}
        <div className="grid grid-cols-12 gap-8 items-center py-8 md:py-12 relative z-10 flex-grow">
          
          {/* --- LEFT COLUMN: FASHION FOCUSED TITLE & OFFERS --- */}
          <div className="col-span-12 lg:col-span-4 space-y-6 text-center lg:text-left relative z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-extrabold text-[10px] uppercase tracking-wider border border-pink-200/40">
              <Sparkles className="w-3.5 h-3.5 fill-pink-100" />
              <span>AI Virtual Showroom</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-[54px] sm:text-[68px] lg:text-[76px] leading-[0.82] text-3d-fashion tracking-tighter uppercase select-none">
                Fashion<br/>Focused
              </h1>
              <p className="text-[10px] text-pink-850/50 font-black tracking-widest uppercase pl-1 mt-2">#Season2026</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold text-pink-950 font-display">25% OFF</h3>
              <p className="text-xs text-pink-900/60 font-semibold tracking-wide">Our all-new premium ethnic arrivals</p>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link 
                to="/collections" 
                className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-100 transition-all cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link 
                to="/try-on"
                className="w-full sm:w-auto px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest text-pink-900 bg-white/70 hover:bg-white border border-pink-150 shadow-sm flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-100 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-pink-900 stroke-none" />
                <span>Watch Lookbook</span>
              </Link>
            </div>

            {/* Customer Social Proof Overlay */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-6 border-t border-pink-100/40">
              <div className="flex -space-x-3">
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Avatar" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Avatar" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" alt="Avatar" />
                <div className="w-9 h-9 rounded-full border-2 border-white bg-pink-100 text-pink-700 font-extrabold text-[9px] flex items-center justify-center shadow-sm">
                  50K+
                </div>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-[10px] text-pink-950 font-black uppercase tracking-wider">Loved by 50K+</p>
                <p className="text-[9px] text-pink-800/60 font-bold uppercase tracking-wider mt-0.5">Happy Fashionistas worldwide ❤️</p>
              </div>
            </div>
          </div>

          {/* --- CENTER COLUMN: 3D MODEL & TRIPLE-LAYER SATURN RINGS --- */}
          <div className="col-span-12 lg:col-span-5 flex justify-center items-center relative py-6 lg:py-0 select-none">
            
            {/* Soft pink blur circle background */}
            <div className="absolute w-[290px] h-[290px] rounded-full bg-gradient-to-tr from-pink-300/40 to-rose-400/30 filter blur-xl animate-pulse" />

            {/* Backdrop Saturn 3D Ring (Layered behind model circle) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-saturn z-10">
              <svg className="w-[430px] h-[330px] overflow-visible" viewBox="0 0 400 400">
                <defs>
                  {/* Saturation color gradient */}
                  <linearGradient id="saturnBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9f1239" />
                    <stop offset="40%" stopColor="#db2777" />
                    <stop offset="70%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                </defs>
                
                {/* 1. Deep Back Shadow Base */}
                <path 
                  d="M 40,200 A 160,50 0 0 1 360,200" 
                  fill="none" 
                  stroke="#6b0c22" 
                  strokeWidth="26" 
                  strokeLinecap="round" 
                  opacity="0.2"
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

            {/* Circular Backdrop Portrait Panel (z-index: 20) */}
            <div className="w-[290px] h-[290px] sm:w-[325px] sm:h-[325px] rounded-full bg-gradient-to-br from-pink-100 to-rose-200 border-[12px] border-white shadow-2xl relative overflow-hidden z-20 flex items-end justify-center group">
              
              {/* Internal circular grid or background */}
              <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_1.5px,transparent_1.5px)] [background-size:18px_18px] opacity-20" />
              
              {/* Premium cropped Indian fashion model */}
              <img 
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80" 
                alt="Aavriti Model" 
                className="h-[105%] w-auto object-cover object-bottom scale-110 translate-y-3 transform group-hover:scale-115 transition-transform duration-700 ease-out select-none pointer-events-none"
              />
            </div>

            {/* Front Saturn 3D Ring (Layered in front of model circle for deep 3D overlap!) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-saturn z-30">
              <svg className="w-[430px] h-[330px] overflow-visible filter drop-shadow-[0_18px_20px_rgba(112,26,45,0.35)]" viewBox="0 0 400 400">
                <defs>
                  <linearGradient id="saturnFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#db2777" />
                    <stop offset="50%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#9f1239" />
                  </linearGradient>
                </defs>
                
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

            {/* Floating 3D Star Sparkles */}
            <div className="absolute top-10 right-4 animate-star-1 z-30 text-rose-500 drop-shadow-md">
              <svg className="w-8 h-8 fill-rose-500" viewBox="0 0 24 24">
                <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
              </svg>
            </div>
            <div className="absolute bottom-16 left-6 animate-star-2 z-30 text-pink-400 drop-shadow-sm">
              <svg className="w-5 h-5 fill-pink-400" viewBox="0 0 24 24">
                <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
              </svg>
            </div>
            <div className="absolute top-28 left-4 animate-star-2 z-10 text-rose-300 opacity-60">
              <svg className="w-4 h-4 fill-rose-300" viewBox="0 0 24 24">
                <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
              </svg>
            </div>
          </div>

          {/* --- RIGHT COLUMN: ARRIVAL DETAILS & DESCRIPTIONS --- */}
          <div className="col-span-12 lg:col-span-3 space-y-6 text-center lg:text-left relative z-20 pl-0 lg:pl-6">
            
            {/* Explore Badge */}
            <div className="space-y-1.5 flex flex-col items-center lg:items-start">
              <p className="text-[10px] text-pink-850/50 font-black tracking-widest uppercase">Explore New</p>
              <h4 className="text-xs font-black text-pink-950 uppercase tracking-widest flex items-center gap-1.5 font-display">
                <span>Arrival Collection</span>
                <span className="w-4 h-[2px] bg-pink-900 inline-block" />
              </h4>
            </div>

            {/* Man Collection Pill Button */}
            <div className="flex justify-center lg:justify-start">
              <Link 
                to="/collections" 
                className="px-5 py-2.5 rounded-full bg-pink-100/60 hover:bg-pink-100 text-pink-900 border border-pink-200/40 font-extrabold text-[9px] uppercase tracking-widest flex items-center gap-2 transform hover:translate-x-1 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-700" />
                <span>Man Collection</span>
                <ArrowRight className="w-3 h-3 text-pink-700" />
              </Link>
            </div>

            {/* Short Editorial Description Block */}
            <div className="space-y-4">
              <div className="flex justify-center lg:justify-start gap-1">
                <Star className="w-3 h-3 fill-rose-450 text-rose-400" />
                <Star className="w-3 h-3 fill-rose-450 text-rose-400" />
                <Star className="w-3 h-3 fill-rose-450 text-rose-400" />
              </div>
              <p className="text-xs text-pink-950/70 font-semibold leading-relaxed max-w-sm mx-auto lg:mx-0 font-sans">
                Fashion is a form of self-expression and autonomy at a particular period. Experience personalized styling that captures your heritage beautifully.
              </p>
              <Link 
                to="/about"
                className="inline-flex items-center gap-1 text-[9px] font-black text-pink-800 hover:text-pink-950 uppercase tracking-widest border-b-2 border-pink-700/30 pb-0.5 transition-colors cursor-pointer"
              >
                <span>Read More</span>
                <ChevronRight className="w-3 h-3 stroke-[3]" />
              </Link>
            </div>
          </div>

        </div>

        {/* ================= 3. THE BOTTOM CATEGORY DOCK BAR ================= */}
        <div className="mt-4 md:mt-8 relative z-30">
          <div className="neomorphic-dock rounded-[32px] p-3 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Category Elements List */}
            <div className="w-full md:w-auto flex flex-wrap md:flex-nowrap justify-around md:justify-start items-center gap-4 pl-0 md:pl-2">
              {categories.map((cat, idx) => (
                <Link 
                  key={idx} 
                  to={`/collections?category=${cat.name.toLowerCase()}`}
                  className="flex items-center gap-3 category-pill p-1.5 pr-4 bg-white/60 hover:bg-white rounded-full border border-pink-100/50 shadow-sm shrink-0 cursor-pointer"
                >
                  {/* Category Circle Avatar */}
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-pink-200 shadow-sm flex items-center justify-center shrink-0">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Title & Count */}
                  <div>
                    <p className="text-[10px] text-pink-950 font-black tracking-tight leading-none">{cat.name}</p>
                    <span className="text-[8px] text-pink-650/70 font-bold uppercase tracking-wider leading-none mt-0.5 block">{cat.count} Items</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Next Category Arrow Button */}
            <div className="hidden md:flex pr-2">
              <Link 
                to="/collections" 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 flex items-center justify-center text-white shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* ================= 4. THE CURATED CATALOG SECTION ================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-20 relative z-20">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 gap-4">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 text-pink-700 font-extrabold text-[9px] uppercase tracking-widest border border-pink-200/25 mb-2">
              <Heart className="w-3 h-3 fill-pink-600 text-pink-600" />
              <span>Curated Festive Looks</span>
            </div>
            <h2 className="text-3xl font-black text-pink-950 font-display tracking-tight leading-none mt-1">Festive Catalog Highlights</h2>
            <p className="mt-2 text-xs text-pink-900/60 font-semibold tracking-wide">Explore high-quality traditional sarees, lehengas, and ethnic options.</p>
          </div>
          <Link 
            to="/collections" 
            className="text-[10px] font-black text-pink-700 hover:text-pink-800 uppercase tracking-widest border-b-2 border-pink-700/20 pb-0.5 flex items-center gap-1 transition-all"
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

      {/* ================= 5. Standalone Portal Footer ================= */}
      <footer className="max-w-7xl mx-auto w-full mt-20 pt-8 border-t border-pink-200/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-pink-950/40 relative z-20">
        <p>&copy; 2026 Aavriti.in, Inc. All rights reserved.</p>
        <div className="flex items-center space-x-4 uppercase tracking-wider">
          <Link to="/try-on" className="hover:text-pink-700 transition-colors">
            Seller Portal
          </Link>
          <span className="opacity-30">|</span>
          <Link to="/admin" target="_blank" className="hover:text-pink-700 transition-colors">
            Admin Portal
          </Link>
        </div>
      </footer>

      {/* Side drawer Cart integration */}
      <CartSidebar />

    </div>
  );
}
