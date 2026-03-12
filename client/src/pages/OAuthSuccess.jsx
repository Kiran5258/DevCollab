import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import API from '../services/api';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      const fetchUserData = async () => {
        try {
          // Set temporary token in axios for profile fetch
          localStorage.setItem('temp_token', token);
          
          const res = await API.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = {
            ...res.data,
            token
          };

          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/dashboard');
          window.location.reload(); // Refresh to update auth state
        } catch (error) {
          console.error('OAuth Error:', error);
          navigate('/login');
        }
      };
      
      fetchUserData();
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Loader2 size={48} className="mx-auto text-primary-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Authenticating...</h2>
        <p className="text-slate-500">Completing your secure login. Please wait.</p>
      </motion.div>
    </div>
  );
};

export default OAuthSuccess;
