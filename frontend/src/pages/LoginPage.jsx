import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple client-side email pattern check
  const isEmailValid = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F8] via-[#FFF8F8] to-[#FFF0F2] p-4 font-sans select-none relative overflow-hidden">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-300/20 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[500px] h-[500px] bg-gradient-to-bl from-pink-300/20 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      
      <div className="max-w-md w-full bg-white/85 backdrop-blur-xl border border-pink-100/40 p-8 sm:p-10 rounded-[32px] shadow-2xl relative overflow-hidden space-y-8 animate-fadeIn">
        
        {/* Logo / Header Section */}
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 bg-pink-100/60 border border-pink-200/50 rounded-2xl flex items-center justify-center mx-auto text-pink-600 shadow-sm">
            <Sparkles className="w-6 h-6 fill-pink-300" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-none font-jakarta">Sign In</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Access your luxury virtual try-on studio
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="text-rose-600 border border-rose-150 bg-rose-50/50 rounded-2xl p-3.5 text-xs font-semibold text-center leading-normal animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block pl-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  required
                  type="email"
                  placeholder="e.g. developer@avriti.ai"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className={`w-full bg-gray-50/50 border ${
                    !isEmailValid ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-200 focus:ring-pink-500'
                  } rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-gray-800 focus:ring-1 focus:outline-none transition-all placeholder-gray-450`}
                />
              </div>
              {!isEmailValid && (
                <span className="text-[9px] font-semibold text-rose-500 block pl-1">Invalid email format</span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block pl-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your security password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-10 pr-11 py-3 text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all placeholder-gray-450"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-pink-650 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isEmailValid || !email || !password}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-2xl shadow-lg shadow-pink-250/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-pink-600 hover:text-pink-700 transition-colors uppercase tracking-wider text-[10px] ml-1">
              Register Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
