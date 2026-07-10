import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  Send, Check, Loader2, ShieldCheck 
} from 'lucide-react';

export default function Footer() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribeStatus('submitting');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <footer
      className="mt-0 font-sans relative overflow-hidden text-left"
      style={{ background: 'linear-gradient(135deg, #5c1a3a 0%, #3d0f28 40%, #2a0a1c 100%)' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-400/10 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-rose-400/10 rounded-full filter blur-[80px] pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto py-16 px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 border-b border-pink-200/10 pb-12">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              to="/home"
              className="text-2xl font-black bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent hover:opacity-90 transition-all tracking-tight duration-300 hover:scale-[1.01] inline-block"
            >
              Aavriti.in
            </Link>

            <p className="text-pink-100 text-xs leading-relaxed max-w-sm font-medium opacity-80">
              Experience the future of ethnic fashion. Instantly try on premium handlooms, sarees, and designer kurtas using our high-fidelity virtual dressing room AI.
            </p>

            {/* Newsletter */}
            <div className="space-y-3 pt-1">
              <span className="block text-[10px] font-extrabold text-pink-200 uppercase tracking-widest">
                Join the Newsletter
              </span>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribeStatus !== 'idle'}
                  className="flex-1 bg-white/15 border border-pink-200/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-pink-200/60 focus:outline-none focus:border-pink-300/60 focus:bg-white/20 transition-all disabled:opacity-50 font-medium backdrop-blur-sm"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus !== 'idle'}
                  className="bg-pink-500 hover:bg-pink-400 text-white rounded-xl px-4 py-2.5 transition-all flex items-center justify-center cursor-pointer disabled:bg-emerald-500 border-0 shrink-0 shadow-lg shadow-pink-900/40 active:scale-95 font-bold"
                >
                  {subscribeStatus === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {subscribeStatus === 'success'    && <Check  className="w-4 h-4 animate-bounce" />}
                  {subscribeStatus === 'idle'       && <Send   className="w-4 h-4" />}
                </button>
              </form>
              {subscribeStatus === 'success' && (
                <p className="text-[10px] text-emerald-300 font-extrabold uppercase tracking-wider">
                  ✓ Successfully subscribed to updates!
                </p>
              )}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-pink-200 tracking-widest uppercase border-b border-pink-200/15 pb-2">
              Shop
            </h3>
            <ul className="space-y-3 pt-1">
              {[
                { to: '/collections?sort=new',          label: 'New Arrivals'    },
                { to: '/collections?category=Sarees',   label: 'Sarees & Drapes' },
                { to: '/collections?category=Lehengas', label: 'Festive Lehengas'},
                { to: '/collections?category=Kurtas & Suits', label: 'Kurtas & Suits'},
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-xs text-pink-100/80 hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-2 group font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-pink-200 tracking-widest uppercase border-b border-pink-200/15 pb-2">
              Support
            </h3>
            <ul className="space-y-3 pt-1">
              {[
                { to: '/support?tab=help',     label: 'Help Center'     },
                { to: '/support?tab=returns',  label: 'Returns Desk'    },
                { to: '/support?tab=shipping', label: 'Shipping Rules'  },
                { to: '/support?tab=contact',  label: 'Contact Support' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-xs text-pink-100/80 hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-2 group font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Social */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-pink-200 tracking-widest uppercase border-b border-pink-200/15 pb-2">
              Legal
            </h3>
            <ul className="space-y-3 pt-1">
              {[
                { to: '/legal?tab=privacy', label: 'Privacy Policy' },
                { to: '/legal?tab=terms',   label: 'Terms of Use'  },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-xs text-pink-100/80 hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-2 group font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex gap-2 pt-3">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="p-2 rounded-xl bg-white/10 border border-pink-200/20 text-pink-200 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 transition-all duration-200">
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer"
                className="p-2 rounded-xl bg-white/10 border border-pink-200/20 text-pink-200 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 transition-all duration-200">
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="p-2 rounded-xl bg-white/10 border border-pink-200/20 text-pink-200 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 transition-all duration-200">
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-pink-300 shrink-0" />
            <p className="text-xs text-pink-200/70 font-medium">
              &copy; 2026 Aavriti.in, Inc. &mdash; Powered by Neural Try-On V2. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-5 text-[10px] font-extrabold uppercase tracking-widest">
            {user && (user.role === 'seller' || user.role === 'admin') && (
              <>
                <Link to="/try-on" className="text-pink-200/70 hover:text-white transition-colors">
                  Seller Portal
                </Link>
                <span className="text-pink-200/20">/</span>
              </>
            )}
            <Link to="/admin" target="_blank" className="text-pink-200/70 hover:text-white transition-colors">
              Admin Gateway
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
