import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import API from '../services/api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(location.search).get('email');

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (!isNaN(char)) newOtp[i] = char;
    });
    setOtp(newOtp);
    if (inputRefs.current[Math.min(pasteData.length, 5)]) {
        inputRefs.current[Math.min(pasteData.length, 5)].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/verify-otp', { email, otp: otpString });
      
      if (res.data.token) {
        localStorage.setItem('user', JSON.stringify(res.data));
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
      setLoading(false);
    }
  };

  // Auto submit when all digits are entered
  useEffect(() => {
    if (otp.join('').length === 6) {
      handleSubmit();
    }
  }, [otp]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="glass-card p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* Background Decorative Blobs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="text-center mb-8 relative">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Verify it's you</h2>
            <p className="text-slate-600 dark:text-slate-400">
              We've sent a 6-digit code to <br />
              <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative">
            <div className="flex justify-between gap-2 md:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                  required
                />
              ))}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/10 p-3 rounded-lg"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            {success ? (
              <div className="flex flex-col items-center justify-center gap-2 py-2 text-green-600 font-bold">
                <Loader2 className="animate-spin" />
                <span>Success! Redirecting...</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Verify Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            )}
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm mb-4">Didn't receive the code?</p>
            <button 
              onClick={() => {/* Add resend logic if needed */}}
              className="text-primary-600 font-bold hover:underline transition-all"
            >
              Resend Code
            </button>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Link to="/register" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm flex items-center justify-center gap-1">
                    Entered wrong email? <span className="text-primary-500 font-medium">Change it</span>
                </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
