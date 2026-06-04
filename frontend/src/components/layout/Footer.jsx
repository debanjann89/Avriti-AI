import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Footer() {
  const { user } = useContext(AuthContext);
  return (
    <footer className="bg-white border-t border-pink-100 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/home" className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">Aavriti.in</Link>
            <p className="mt-4 text-gray-500 text-sm">
              Discover the richness of Indian ethnic wear, powered by Aavriti Try On AI technology.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/collections?sort=new" className="text-base text-gray-500 hover:text-pink-600 transition-colors">New Arrivals</Link></li>
              <li><Link to="/collections?category=Sarees" className="text-base text-gray-500 hover:text-pink-600 transition-colors">Sarees</Link></li>
              <li><Link to="/collections?category=Lehengas" className="text-base text-gray-500 hover:text-pink-600 transition-colors">Lehengas</Link></li>
              <li><Link to="/collections?category=Kurtas & Suits" className="text-base text-gray-500 hover:text-pink-600 transition-colors">Suits & Kurtas</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/support?tab=help" className="text-base text-gray-500 hover:text-pink-600 transition-colors">Help Center</Link></li>
              <li><Link to="/support?tab=returns" className="text-base text-gray-500 hover:text-pink-600 transition-colors">Returns</Link></li>
              <li><Link to="/support?tab=shipping" className="text-base text-gray-500 hover:text-pink-600 transition-colors">Shipping</Link></li>
              <li><Link to="/support?tab=contact" className="text-base text-gray-500 hover:text-pink-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/legal?tab=privacy" className="text-base text-gray-500 hover:text-pink-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal?tab=terms" className="text-base text-gray-500 hover:text-pink-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2026 Aavriti.in, Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wider">
            {user && (user.role === 'seller' || user.role === 'admin') && (
              <>
                <Link to="/try-on" className="text-gray-400 hover:text-pink-600 transition-colors">
                  Seller Portal
                </Link>
                <span className="text-gray-300">|</span>
              </>
            )}
            <Link to="/admin" target="_blank" className="text-gray-400 hover:text-pink-600 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

