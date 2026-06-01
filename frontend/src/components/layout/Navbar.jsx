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
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-pink-100 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Brand logo & link */}
            <div className="flex items-center space-x-8">
              <div className="flex flex-col">
                <Link to="/" className="text-2xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent leading-none">
                  Aavriti AI
                </Link>
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mt-1 leading-none">
                  Indian Fashion, Reimagined for You
                </span>
              </div>
              
              <div className="hidden lg:flex space-x-6 ml-6">
                <Link to="/collections" className="text-gray-700 hover:text-pink-600 font-extrabold text-[11px] uppercase tracking-widest transition-all">
                  Collections
                </Link>
                <Link to="/collections" className="text-gray-700 hover:text-pink-600 font-extrabold text-[11px] uppercase tracking-widest transition-all">
                  Categories
                </Link>
                <Link to="/try-on" className="text-pink-700 hover:text-pink-850 font-extrabold text-[11px] uppercase tracking-widest transition-all flex items-center gap-1">
                  <span>AI Stylist</span>
                  <Sparkles className="w-3 h-3 text-orange-500 fill-orange-500 animate-pulse" />
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-pink-600 font-extrabold text-[11px] uppercase tracking-widest transition-all">
                  About Us
                </Link>
                <a href="#" className="text-gray-700 hover:text-pink-600 font-extrabold text-[11px] uppercase tracking-widest transition-all">
                  Blog
                </a>
              </div>
            </div>
            
            {/* Right Buttons group */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Icon Trigger */}
              <button 
                onClick={() => navigate('/collections')}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-pink-50/50 border border-slate-100 flex items-center justify-center text-gray-600 hover:text-pink-600 transition-all cursor-pointer"
              >
                <Search className="h-4.5 w-4.5 stroke-[1.8]" />
              </button>
              
              {/* Shopping Cart Trigger */}
              <button onClick={toggleCart} className="text-gray-500 hover:text-pink-600 transition-colors relative cursor-pointer p-1">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-extrabold leading-none text-white bg-pink-600 rounded-full shrink-0 shadow-sm shadow-pink-100">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Dynamic User Profile Picture & Dropdown menu */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                    className="flex items-center gap-1.5 focus:outline-none hover:opacity-90 transition-opacity cursor-pointer p-1"
                  >
                    {user.profile_picture ? (
                      <div className="w-8 h-8 rounded-full border border-pink-200 overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
                        <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-pink-100 bg-pink-50 flex items-center justify-center text-pink-600 shadow-inner shrink-0">
                        <User className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180 text-pink-600' : ''}`} />
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
