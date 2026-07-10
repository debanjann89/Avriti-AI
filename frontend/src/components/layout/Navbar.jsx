import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Sparkles, Sliders, MapPin, ShoppingBag, LogOut, ChevronDown } from 'lucide-react';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import CartSidebar from '../CartSidebar';
import axios from 'axios';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, toggleCart } = useContext(CartContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [blogEnabled, setBlogEnabled] = useState(true);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close dropdown on clicking outside
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

  // Fetch blog configuration on load/nav change to support live disable updates
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/blog/settings")
      .then(res => {
        setBlogEnabled(res.data.blog_enabled);
      })
      .catch(e => console.error("Error fetching navbar blog settings", e));
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .nav-link-premium {
          position: relative;
          color: #1E1E1E;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link-premium::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #D81B60, #A30D45);
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link-premium:hover::after {
          width: 100%;
        }
        .nav-link-premium:hover {
          color: #D81B60;
          transform: translateY(-0.5px);
        }
        
        .navbar-luxury-blur {
          background: rgba(255, 248, 248, 0.88);
          backdrop-filter: blur(16px) saturate(180%);
          box-shadow: 
            0px 4px 30px rgba(216, 27, 96, 0.02),
            0px 1px 0px rgba(216, 27, 96, 0.06);
        }
      `}} />
      <nav className="navbar-luxury-blur sticky top-0 z-50 border-b border-[#D81B60]/10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Brand logo & link */}
            <div className="flex items-center space-x-8">
              <Link to={user ? "/home" : "/"} className="text-2xl font-black font-jakarta tracking-tight bg-gradient-to-r from-[#D81B60] via-[#A30D45] to-[#D81B60] bg-clip-text text-transparent leading-none hover:scale-[1.01] transition-transform">
                Aavriti AI
              </Link>
              
              <div className="hidden lg:flex space-x-6 items-center ml-8">
                <Link 
                  to="/home" 
                  className={location.pathname === '/home' 
                    ? "px-4 py-2 rounded-full bg-[#F8D7DA]/75 border border-[#D81B60]/20 text-[#D81B60] font-black text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/30 hover:scale-[1.02] transition-all" 
                    : "nav-link-premium font-extrabold text-[10px] uppercase tracking-widest"}
                >
                  Home
                </Link>
                <Link 
                  to="/collections" 
                  className={location.pathname === '/collections' 
                    ? "px-4 py-2 rounded-full bg-[#F8D7DA]/75 border border-[#D81B60]/20 text-[#D81B60] font-black text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/30 hover:scale-[1.02] transition-all" 
                    : "nav-link-premium font-extrabold text-[10px] uppercase tracking-widest"}
                >
                  Collections
                </Link>
                <Link to="/collections" className="nav-link-premium font-extrabold text-[10px] uppercase tracking-widest">
                  Categories
                </Link>
                {user && (user.role === 'seller' || user.role === 'admin') && (
                  <Link 
                    to="/try-on" 
                    className={location.pathname === '/try-on' 
                      ? "px-4 py-2 rounded-full bg-[#F8D7DA]/75 border border-[#D81B60]/20 text-[#D81B60] font-black text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/30 hover:scale-[1.02] flex items-center gap-1.5 transition-all" 
                      : "nav-link-premium font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-1.5"}
                  >
                    <span>AI Stylist</span>
                    <Sparkles className={`w-3.5 h-3.5 ${location.pathname === '/try-on' ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-[#D81B60] fill-none'}`} />
                  </Link>
                )}
                <Link 
                  to="/about" 
                  className={location.pathname === '/about' 
                    ? "px-4 py-2 rounded-full bg-[#F8D7DA]/75 border border-[#D81B60]/20 text-[#D81B60] font-black text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/30 hover:scale-[1.02] transition-all" 
                    : "nav-link-premium font-extrabold text-[10px] uppercase tracking-widest"}
                >
                  About Us
                </Link>
                {blogEnabled && (
                  <Link 
                    to="/blog" 
                    className={location.pathname === '/blog' 
                      ? "px-4 py-2 rounded-full bg-[#F8D7DA]/75 border border-[#D81B60]/20 text-[#D81B60] font-black text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/30 hover:scale-[1.02] transition-all" 
                      : "nav-link-premium font-extrabold text-[10px] uppercase tracking-widest"}
                  >
                    Blog
                  </Link>
                )}
              </div>
            </div>
            
            {/* Right Buttons group */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Icon Trigger */}
              <button 
                onClick={() => navigate('/collections')}
                className="w-10 h-10 rounded-full bg-white border border-[#D81B60]/10 hover:border-[#D81B60]/35 text-[#1E1E1E] hover:text-[#D81B60] flex items-center justify-center transition-all duration-300 hover:scale-[1.05] hover:shadow-md hover:shadow-pink-100/50 cursor-pointer shadow-sm"
              >
                <Search className="h-4.5 w-4.5 stroke-[2]" />
              </button>
              
              {/* Shopping Cart Trigger */}
              <button 
                onClick={toggleCart} 
                className="w-10 h-10 rounded-full bg-white border border-[#D81B60]/10 hover:border-[#D81B60]/35 text-[#1E1E1E] hover:text-[#D81B60] flex items-center justify-center transition-all duration-300 hover:scale-[1.05] hover:shadow-md hover:shadow-pink-100/50 cursor-pointer shadow-sm relative"
              >
                <ShoppingCart className="h-4.5 w-4.5 stroke-[2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[8.5px] font-black leading-none text-white bg-[#D81B60] rounded-full shrink-0 shadow-sm shadow-pink-200 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Dynamic User Profile Picture & Dropdown menu */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                    className="flex items-center gap-1 focus:outline-none hover:opacity-95 transition-opacity cursor-pointer p-0.5"
                  >
                    {user.profile_picture ? (
                      <div className="w-9 h-9 rounded-full border border-pink-200 overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
                        <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full border border-[#D81B60]/20 bg-[#F8D7DA]/40 flex items-center justify-center text-[#D81B60] shadow-inner shrink-0 hover:border-[#D81B60]/40 transition-colors">
                        <User className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180 text-[#D81B60]' : ''}`} />
                  </button>

                  {/* Dropdown Card */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3.5 w-72 bg-white/95 backdrop-blur-md border border-pink-100 rounded-[28px] shadow-2xl p-5 z-50 animate-dropdownOpen origin-top-right font-sans text-left">
                      
                      {/* Connected Arrow Indicator */}
                      <div className="absolute right-4.5 -top-2 w-4.5 h-4.5 bg-white rotate-45 border-t border-l border-pink-100 z-50"></div>
                      
                      {/* Profile Card Header */}
                      <div className="flex items-center gap-3.5 border-b border-gray-100/80 pb-4 mb-4 relative z-50">
                        {user.profile_picture ? (
                          <div className="w-12 h-12 rounded-full border-2 border-pink-500 overflow-hidden bg-white shadow-md flex items-center justify-center shrink-0">
                            <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full border-2 border-pink-500 bg-pink-50 flex items-center justify-center text-pink-600 shadow-inner shrink-0">
                            <User className="h-6 w-6 stroke-[2]" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-black text-slate-800 truncate leading-snug">{user.name}</span>
                          <span className="text-[10px] text-gray-400 truncate mt-0.5">{user.email || "Fashion Store Member"}</span>
                          <span className="inline-flex items-center w-fit text-[8px] font-extrabold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-widest border border-pink-200/50">
                            Size Profile: {user.body_type || "M"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Dropdown Links List */}
                      <div className="flex flex-col gap-1 relative z-50">
                        <Link 
                          to="/profile?tab=profile" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-2xl hover:bg-pink-50/30 transition-all"
                        >
                          <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0 group-hover:bg-pink-100 transition-colors">
                            <Sliders className="w-4 h-4 stroke-[2]" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-gray-700 group-hover:text-pink-600 transition-colors">Profile & Sizing</span>
                            <span className="text-[9px] text-gray-400 mt-0.5 leading-snug">Edit dimensions & fit preferences</span>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/profile?tab=addresses" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-2xl hover:bg-pink-50/30 transition-all"
                        >
                          <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0 group-hover:bg-pink-100 transition-colors">
                            <MapPin className="w-4 h-4 stroke-[2]" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-gray-700 group-hover:text-pink-600 transition-colors">Saved Addresses</span>
                            <span className="text-[9px] text-gray-400 mt-0.5 leading-snug">Manage shipping destinations</span>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/profile?tab=orders" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-2xl hover:bg-pink-50/30 transition-all"
                        >
                          <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0 group-hover:bg-pink-100 transition-colors">
                            <ShoppingBag className="w-4 h-4 stroke-[2]" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-gray-700 group-hover:text-pink-600 transition-colors">Order History</span>
                            <span className="text-[9px] text-gray-400 mt-0.5 leading-snug">Track shipment status & invoices</span>
                          </div>
                        </Link>
                      </div>

                      <hr className="border-gray-100/80 my-3.5 relative z-50" />
                      
                      <button
                        onClick={handleLogout}
                        className="group w-full flex items-center gap-3 p-2.5 rounded-2xl text-rose-500 hover:bg-rose-50/50 transition-all cursor-pointer text-left relative z-50"
                      >
                        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 group-hover:bg-rose-100 transition-colors">
                          <LogOut className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-rose-750">Logout Account</span>
                          <span className="text-[9px] text-rose-450 mt-0.5 leading-snug">Sign out of Aavriti AI session</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="w-10 h-10 rounded-full bg-white border border-[#D81B60]/10 hover:border-[#D81B60]/35 text-[#1E1E1E] hover:text-[#D81B60] flex items-center justify-center transition-all duration-300 hover:scale-[1.05] hover:shadow-md hover:shadow-pink-100/50 cursor-pointer shadow-sm"
                >
                  <User className="h-4.5 w-4.5 stroke-[2]" />
                </Link>
              )}

              {/* Mobile Menu Icon */}
              <button className="md:hidden text-gray-500 hover:text-pink-600 transition-colors cursor-pointer p-1">
                <Menu className="h-5 w-5" />
              </button>
            </div>
            
          </div>
        </div>
      </nav>
      <CartSidebar />
    </>
  );
}
