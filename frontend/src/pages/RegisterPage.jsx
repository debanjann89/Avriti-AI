import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Check, Key } from 'lucide-react';
import axios from 'axios';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Input fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // UI Flow states
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expose toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 8000);
  };

  // Proper email validator regex check
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = email ? EMAIL_REGEX.test(email) : true;

  // Resend OTP Timer effect
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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

  // Phase 1: Request OTP code
  const handleSendOtp = async () => {
    if (!name || !email || !password) {
      setError("Please fill out name, email, and password.");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (strength.score < 3) {
      setError("Please write a stronger password before requesting OTP verification.");
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/send-otp', { email });
      setOtpSent(true);
      setResendTimer(60);
      
      showToast("Verification code sent! Please check your email inbox.", "success");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to send verification code. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Phase 2: Verify & Submit Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await register(name, email, password, otp);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.detail || 'Incorrect or expired verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F8] via-[#FFF8F8] to-[#FFF0F2] p-4 font-sans select-none relative overflow-hidden">
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#F8D7DA]/40 to-transparent rounded-full filter blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-[#FFF0F2]/50 to-transparent rounded-full filter blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Main Glassmorphic Register Card */}
      <div className="max-w-md w-full bg-white/60 backdrop-blur-2xl border border-white/60 p-8 sm:p-10 rounded-[32px] shadow-2xl relative overflow-hidden space-y-7 animate-fadeIn">

        {/* Logo / Header Section (Logo is NOT linked to home page) */}
        <div className="text-center space-y-4">
          <div>
            <img 
              src="/Logo.jpg" 
              alt="Aavriti AI Logo" 
              className="w-20 h-20 object-cover rounded-3xl mx-auto border-2 border-white shadow-xl select-none"
            />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase leading-none font-jakarta">Register</h3>
            <p className="text-[9px] text-gray-450 font-bold uppercase tracking-widest">
              Create your account to access Avriti AI
            </p>
          </div>
        </div>

        {error && (
          <div className="text-rose-600 border border-rose-150 bg-rose-50/50 rounded-2xl p-3.5 text-xs font-semibold text-center leading-normal animate-shake">
            {error}
          </div>
        )}

        {!otpSent ? (
          /* Step 1: Input details and validate */
          <div className="space-y-5">
            <div className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-bold text-gray-455 uppercase tracking-widest block pl-1">Full Name</label>
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
                    className="w-full bg-white/80 border border-gray-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-gray-855 focus:border-[#D81B60] focus:ring-[#D81B60] focus:ring-1 focus:outline-none transition-all placeholder-gray-400 shadow-sm"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-bold text-gray-455 uppercase tracking-widest block pl-1">Email Address</label>
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
                    className={`w-full bg-white/80 border ${
                      !isEmailValid ? 'border-rose-300 focus:ring-rose-500' : 'border-gray-200/80 focus:border-[#D81B60] focus:ring-[#D81B60]'
                    } rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-gray-855 focus:ring-1 focus:outline-none transition-all placeholder-gray-400 shadow-sm`}
                  />
                </div>
                {!isEmailValid && (
                  <span className="text-[9px] font-semibold text-rose-500 block pl-1 animate-fadeIn">Invalid email format (e.g. name@domain.com)</span>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-bold text-gray-455 uppercase tracking-widest block pl-1">Password</label>
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
                    className="w-full bg-white/80 border border-gray-200/80 rounded-2xl pl-10 pr-11 py-3 text-xs font-semibold text-gray-855 focus:border-[#D81B60] focus:ring-[#D81B60] focus:ring-1 focus:outline-none transition-all placeholder-gray-400 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#D81B60] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2.5 space-y-2 animate-fadeIn">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400 font-bold uppercase tracking-wider">Difficulty:</span>
                      <span className={`font-black uppercase tracking-wider ${strength.text}`}>{strength.label}</span>
                    </div>
                    
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
                type="button"
                onClick={handleSendOtp}
                disabled={isSubmitting || !isEmailValid || !name || !email || !password || strength.score < 3}
                className="w-full bg-gradient-to-r from-[#D81B60] via-[#C2185B] to-[#AD1457] hover:from-[#C2185B] hover:to-[#880E4F] text-white text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-2xl shadow-lg shadow-pink-250/20 hover:shadow-[#D81B60]/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer border border-[#D81B60]/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Verification code input */
          <form onSubmit={handleSubmit} className="space-y-5 animate-slideDown">
            <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl text-left space-y-1">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wide">OTP Sent Successfully</p>
              <p className="text-[11px] text-emerald-600 leading-normal">
                We've sent a 6-digit confirmation code to <strong className="text-emerald-700 font-bold">{email}</strong>.
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold text-gray-455 uppercase tracking-widest block pl-1">6-Digit Verification Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="Enter code e.g. 123456"
                  value={otp}
                  onChange={e => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    if (error) setError('');
                  }}
                  className="w-full bg-white/80 border border-gray-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-gray-855 focus:border-[#D81B60] focus:ring-[#D81B60] focus:ring-1 focus:outline-none tracking-widest text-center font-mono shadow-sm"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] px-1">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-gray-500 hover:text-[#D81B60] font-bold uppercase tracking-wider"
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={resendTimer > 0 || isSubmitting}
                onClick={handleSendOtp}
                className="text-[#D81B60] hover:text-[#AD1457] font-extrabold uppercase tracking-wider disabled:opacity-50"
              >
                {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || otp.length < 6}
                className="w-full bg-gradient-to-r from-[#D81B60] via-[#C2185B] to-[#AD1457] hover:from-[#C2185B] hover:to-[#880E4F] text-white text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-2xl shadow-lg shadow-pink-250/20 hover:shadow-[#D81B60]/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer border border-[#D81B60]/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Create Account</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-2 border-t border-gray-100 font-sans">
          <p className="text-xs font-semibold text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#D81B60] hover:text-[#AD1457] transition-colors uppercase tracking-wider text-[10px] ml-1">
              Sign In
            </Link>
          </p>
        </div>

      </div>

      {/* Floating Branded Notification Toast */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 px-5 py-4 bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl flex items-center gap-3 animate-slideIn max-w-sm">
          <div className={`w-2.5 h-2.5 rounded-full animate-pulse shrink-0 ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          <div className="text-left font-sans">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-wider leading-none">
              {toast.type === 'error' ? 'Error' : 'Notification'}
            </span>
            <span className="block text-xs font-bold text-slate-800 mt-1 leading-normal">{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}
