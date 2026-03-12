import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';
import { Menu, X, Code2, User, LogOut, LayoutDashboard, Search, PlusSquare, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-white/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-indigo-500/20">
                <Code2 className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter gradient-text">DevCollab</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 font-bold tracking-tight transition-colors">
              <Search size={18} /> Explore
            </Link>
            {user ? (
              <>
                <Link to="/create-project" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 font-bold tracking-tight transition-colors">
                  <PlusSquare size={18} /> Post
                </Link>
                <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 font-bold tracking-tight transition-colors">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/chat" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 font-bold tracking-tight transition-colors relative">
                  <MessageSquare size={18} /> Chat Hub
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-slate-950"></span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Avatar
                      src={user.profileImage}
                      name={user.name}
                      size="sm"
                      className="border-2 border-primary-500"
                    />
                  </button>
                  <div className="absolute right-0 w-56 mt-3 p-2 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Link 
                      to={`/profile/${user._id}`} 
                      className="px-4 py-3 rounded-xl hover:bg-indigo-600 hover:text-white flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold transition-all"
                    >
                      <User size={18} className="opacity-70" />
                      My Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="px-4 py-3 rounded-xl hover:bg-indigo-600 hover:text-white flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold transition-all"
                      >
                        <LayoutDashboard size={18} className="opacity-70" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="my-2 border-t border-slate-100 dark:border-slate-800 mx-2"></div>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-600 hover:text-white text-red-600 font-bold flex items-center gap-3 transition-all"
                    >
                      <LogOut size={18} className="opacity-70" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-500">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 glass"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/explore" className="block px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-600">
                Explore
              </Link>
              {user ? (
                <>
                  <Link to="/create-project" className="block px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-600">
                    Post Project
                  </Link>
                  <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-600">
                    Dashboard
                  </Link>
                  <Link to="/chat" className="block px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-600">
                    Community Chat
                  </Link>
                  <button onClick={onLogout} className="w-full text-left block px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-600">
                    Login
                  </Link>
                  <Link to="/register" className="block px-3 py-2 rounded-lg bg-primary-600 text-white font-medium text-center">
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
