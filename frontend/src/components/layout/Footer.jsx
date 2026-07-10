import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  ShoppingBag, Heart, Send, Check, Loader2, 
  Globe, ShieldCheck 
} from 'lucide-react';

export default function Footer() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle'); // 'idle', 'submitting', 'success'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribeStatus('submitting');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => {
        setSubscribeStatus('idle');
      }, 4000);
    }, 1500);
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-16 font-sans relative overflow-hidden text-left">
      
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-500/5 rounded-full filter blur-[80px] pointer-events-none transform -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-500/5 rounded-full filter blur-[80px] pointer-events-none transform translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto py-16 px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 border-b border-slate-900 pb-12">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link 
              to="/home" 
              className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent hover:opacity-90 transition-all tracking-tight duration-300 hover:scale-[1.01] inline-block"
            >
              Aavriti.in
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-medium">
              Experience the future of ethnic fashion. Instantly try on premium handlooms, sarees, and designer kurtas using our high-fidelity virtual dressing room AI.
            </p>
            
            {/* Interactive Newsletter Signup */}
            <div className="space-y-3 pt-2">
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Join the Newsletter</span>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <input 
                    type="email" 
                    required
                    placeholder="Enter email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribeStatus === 'submitting' || subscribeStatus === 'success'}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/80 transition-colors disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribeStatus === 'submitting' || subscribeStatus === 'success'}
                  className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-4.5 py-2.5 transition-all flex items-center justify-center cursor-pointer disabled:bg-emerald-600 border-0 shrink-0 shadow-md shadow-pink-950/20 active:scale-95"
                >
                  {subscribeStatus === 'submitting' && (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  )}
                  {subscribeStatus === 'success' && (
                    <Check className="w-4 h-4 text-white animate-bounce" />
                  )}
                  {subscribeStatus === 'idle' && (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </form>
              
              {/* Subscription Success Message */}
              {subscribeStatus === 'success' && (
                <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider animate-fadeIn">
                  ✓ Successfully subscribed to updates!
                </p>
              )}
            </div>
          </div>

          {/* Nav Column: Shop */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-slate-200 tracking-widest uppercase border-b border-slate-900 pb-2">Shop</h3>
            <ul className="space-y-3 pt-1">
              <li>
                <Link to="/collections?sort=new" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">New Arrivals</span>
                </Link>
              </li>
              <li>
                <Link to="/collections?category=Sarees" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">Sarees & Drapes</span>
                </Link>
              </li>
              <li>
                <Link to="/collections?category=Lehengas" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">Festive Lehengas</span>
                </Link>
              </li>
              <li>
                <Link to="/collections?category=Kurtas & Suits" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">Kurtas & Suits</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column: Support */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-slate-200 tracking-widest uppercase border-b border-slate-900 pb-2">Support</h3>
            <ul className="space-y-3 pt-1">
              <li>
                <Link to="/support?tab=help" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">Help Center</span>
                </Link>
              </li>
              <li>
                <Link to="/support?tab=returns" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">Returns Desk</span>
                </Link>
              </li>
              <li>
                <Link to="/support?tab=shipping" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">Shipping Rules</span>
                </Link>
              </li>
              <li>
                <Link to="/support?tab=contact" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">Contact Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column: Legal */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-slate-200 tracking-widest uppercase border-b border-slate-900 pb-2">Legal</h3>
            <ul className="space-y-3 pt-1">
              <li>
                <Link to="/legal?tab=privacy" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">Privacy Shield</span>
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=terms" className="text-xs text-slate-400 hover:text-pink-400 hover:translate-x-1.5 transition-all duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="hover-underline-anim">Terms of Use</span>
                </Link>
              </li>
              <li className="pt-2 flex gap-3 text-slate-500">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-all hover:scale-110 duration-200">
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-all hover:scale-110 duration-200">
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-all hover:scale-110 duration-200">
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & Portals */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-pink-500" />
            <p className="text-xs text-slate-400 font-medium">
              &copy; 2026 Aavriti.in, Inc. Powered by Neural Try-On V2. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-5 text-[10px] font-extrabold uppercase tracking-widest">
            {user && (user.role === 'seller' || user.role === 'admin') && (
              <>
                <Link to="/try-on" className="text-slate-400 hover:text-pink-500 transition-colors hover-underline-anim">
                  Seller Portal
                </Link>
                <span className="text-slate-800">/</span>
              </>
            )}
            <Link to="/admin" target="_blank" className="text-slate-400 hover:text-pink-500 transition-colors hover-underline-anim">
              Admin Gateway
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
