import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Check, X } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side email validation check
  const isEmailValid = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true;

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) {
      return {
        score: 0,
        label: 'None',
        color: 'bg-gray-150',
        text: 'text-gray-400',
        criteria: { length: false, casing: false, number: false, special: false }
      };
    }

    const hasMinLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUpper && hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    let label = 'Weak';
    let color = 'bg-rose-500';
    let text = 'text-rose-600';

    if (score === 3) {
      label = 'Medium';
      color = 'bg-amber-500';
      text = 'text-amber-600';
    } else if (score >= 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
      text = 'text-emerald-600';
    }

    return {
      score,
      label,
      color,
      text,
      criteria: {
        length: hasMinLength,
        casing: hasUpper && hasLower,
        number: hasNumber,
        special: hasSpecial
      }
    };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (strength.score < 3) {
      setError("Please choose a stronger password before registering.");
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. This email may already be registered.');
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
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-none font-jakarta">Register</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Create your account to access Avriti AI
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
            {/* Full Name Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block pl-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  required
                  type="text"
                  placeholder="e.g. Priyanshu Sharma"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all placeholder-gray-450"
                />
              </div>
            </div>

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
                  placeholder="e.g. partner@boutique.com"
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
                  placeholder="Create a strong password"
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

              {/* Password Strength Difficulty Indicator */}
              {password && (
                <div className="mt-2.5 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">Difficulty:</span>
                    <span className={`font-black uppercase tracking-wider ${strength.text}`}>{strength.label}</span>
                  </div>
                  
                  {/* Dynamic Strength Bars */}
                  <div className="flex gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          index <= strength.score ? strength.color : 'bg-gray-100'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Password Checklist Criteria */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1.5 text-[9px] text-gray-500 font-semibold leading-none">
                    <div className="flex items-center gap-1.5">
                      {strength.criteria.length ? (
                        <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                      ) : (
                        <div className="w-3 h-3 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className={strength.criteria.length ? 'text-gray-700' : 'text-gray-400'}>Min 8 characters</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {strength.criteria.casing ? (
                        <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                      ) : (
                        <div className="w-3 h-3 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className={strength.criteria.casing ? 'text-gray-700' : 'text-gray-400'}>Upper & Lower case</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {strength.criteria.number ? (
                        <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                      ) : (
                        <div className="w-3 h-3 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className={strength.criteria.number ? 'text-gray-700' : 'text-gray-400'}>At least one number</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {strength.criteria.special ? (
                        <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                      ) : (
                        <div className="w-3 h-3 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className={strength.criteria.special ? 'text-gray-700' : 'text-gray-400'}>Special symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isEmailValid || !name || !email || !password || strength.score < 3}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-2xl shadow-lg shadow-pink-250/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-pink-600 hover:text-pink-700 transition-colors uppercase tracking-wider text-[10px] ml-1">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
