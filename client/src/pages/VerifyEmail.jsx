import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import API from '../services/api';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data.message);
        
        // Auto login
        if (res.data.token) {
          localStorage.setItem('user', JSON.stringify(res.data));
          setTimeout(() => {
            navigate('/dashboard');
            window.location.reload();
          }, 2000);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 rounded-[2.5rem] text-center max-w-md w-full"
      >
        {status === 'loading' && (
          <div className="space-y-6">
            <Loader2 size={64} className="mx-auto text-primary-600 animate-spin" />
            <h2 className="text-2xl font-bold">Verifying your email...</h2>
            <p className="text-slate-500">Please wait while we confirm your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold">Verified!</h2>
            <p className="text-slate-600 dark:text-slate-400">{message}</p>
            <Link to="/login" className="btn-primary inline-block w-full py-3">
              Proceed to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={48} />
            </div>
            <h2 className="text-3xl font-bold">Oops!</h2>
            <p className="text-slate-600 dark:text-slate-400">{message}</p>
            <div className="flex flex-col gap-4">
              <Link to="/register" className="btn-primary w-full py-3">
                Try Registering Again
              </Link>
              <Link to="/" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
