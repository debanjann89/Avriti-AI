import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Sparkles, Sliders, MapPin, ShoppingBag, LogOut, ChevronDown } from 'lucide-react';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import CartSidebar from '../CartSidebar';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, toggleCart } = useContext(CartContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
              <div className="flex flex-col">
                <Link to="/" className="text-2xl font-black font-jakarta tracking-tight bg-gradient-to-r from-[#D81B60] via-[#A30D45] to-[#D81B60] bg-clip-text text-transparent leading-none hover:scale-[1.01] transition-transform">
                  Aavriti AI
                </Link>
                <span className="text-[7.5px] text-[#A30D45]/80 font-black uppercase tracking-[0.18em] mt-1.5 leading-none">
                  Indian Fashion, Reimagined for You
                </span>
              </div>
              
              <div className="hidden lg:flex space-x-6 items-center ml-8">
                <Link to="/collections" className="nav-link-premium font-extrabold text-[10px] uppercase tracking-widest">
                  Collections
                </Link>
                <Link to="/collections" className="nav-link-premium font-extrabold text-[10px] uppercase tracking-widest">
                  Categories
                </Link>
                <Link to="/try-on" className="px-4 py-2 rounded-full bg-[#F8D7DA]/70 border border-[#D81B60]/20 hover:border-[#D81B60]/40 text-[#D81B60] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm shadow-pink-100 hover:shadow-md hover:shadow-pink-200/40 hover:scale-[1.03] active:scale-98">
                  <span>AI Stylist</span>
                  <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                </Link>
                <Link to="/about" className="nav-link-premium font-extrabold text-[10px] uppercase tracking-widest">
                  About Us
                </Link>
                <a href="#" className="nav-link-premium font-extrabold text-[10px] uppercase tracking-widest">
                  Blog
                </a>
              </div>
            </div>
            
            {/* Right Buttons group */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Icon Trigger */}
              <button 
                onClick={() => navigate('/collections')}
                className="w-9.5 h-9.5 rounded-full bg-white border border-[#D81B60]/10 hover:border-[#D81B60]/35 text-[#1E1E1E] hover:text-[#D81B60] flex items-center justify-center transition-all duration-300 hover:scale-[1.05] hover:shadow-md hover:shadow-pink-100/50 cursor-pointer shadow-sm"
              >
                <Search className="h-4.5 w-4.5 stroke-[2]" />
              </button>
              
              {/* Shopping Cart Trigger */}
              <button 
                onClick={toggleCart} 
                className="w-9.5 h-9.5 rounded-full bg-white border border-[#D81B60]/10 hover:border-[#D81B60]/35 text-[#1E1E1E] hover:text-[#D81B60] flex items-center justify-center transition-all duration-300 hover:scale-[1.05] hover:shadow-md hover:shadow-pink-100/50 cursor-pointer shadow-sm relative"
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
                      <div className="w-8.5 h-8.5 rounded-full border border-pink-200 overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
                        <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8.5 h-8.5 rounded-full border border-[#D81B60]/20 bg-[#F8D7DA]/40 flex items-center justify-center text-[#D81B60] shadow-inner shrink-0 hover:border-[#D81B60]/40 transition-colors">
                        <User className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180 text-[#D81B60]' : ''}`} />
                  </button>

                  {/* Dropdown Card */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-52 bg-white border border-pink-150 rounded-2xl shadow-xl py-2.5 z-50 animate-fadeIn font-sans">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1.5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Signed in as</p>
                        <p className="text-xs font-black text-slate-800 truncate mt-0.5">{user.name}</p>
                      </div>
                      
                      <Link 
                        to="/profile?tab=profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-pink-50/30 hover:text-pink-600 transition-colors"
                      >
                        <Sliders className="w-4 h-4 stroke-[2]" />
                        <span>Profile & Sizing</span>
                      </Link>
                      
                      <Link 
                        to="/profile?tab=addresses" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-pink-50/30 hover:text-pink-600 transition-colors"
                      >
                        <MapPin className="w-4 h-4 stroke-[2]" />
                        <span>Saved Addresses</span>
                      </Link>
                      
                      <Link 
                        to="/profile?tab=orders" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-pink-50/30 hover:text-pink-600 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 stroke-[2]" />
                        <span>Order History</span>
                      </Link>
                      
                      <hr className="border-gray-100 my-1.5" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 stroke-[2]" />
                        <span>Logout Account</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-gray-500 hover:text-pink-600 transition-colors cursor-pointer p-1">
                  <User className="h-5 w-5" />
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
