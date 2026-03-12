import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Code2, Hash, Heart, FolderPlus, Settings, User as UserIcon, Github, Briefcase, ExternalLink, Trash2, Edit, MessageSquare, MapPin, Bell, Shield, Download, Share2, Globe, Check, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, setCredentials } from '../redux/slices/authSlice';
import { X, AlertTriangle } from 'lucide-react';
import API from '../services/api';
import Avatar from '../components/Avatar';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(true);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleDeactivate = async () => {
    try {
      await API.delete('/users/profile');
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Error deactivating account:', error);
    }
  };

  const updatePreference = async (key, value) => {
    try {
      let updateData;
      if (key === 'email') {
        updateData = { notifications: { ...user.notifications, email: value } };
      } else if (key === 'push') {
        updateData = { notifications: { ...user.notifications, push: value } };
      } else {
        updateData = { isPublic: value };
      }
      
      const res = await API.put('/users/profile', updateData);
      dispatch(setCredentials(res.data));
    } catch (error) {
       console.error('Error updating preference:', error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await API.get('/users/profile');
        setSavedProjects(profileRes.data.savedProjects || []);

        const projectsRes = await API.get('/projects');
        const myProjects = projectsRes.data.filter(p => p.createdBy._id === user._id);
        setProjects(myProjects);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="relative">
            <Avatar 
              src={user?.profileImage}
              name={user?.name}
              size="xl"
              className="rounded-3xl border-4 border-white dark:border-slate-800 shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-2 rounded-xl border-4 border-white dark:border-slate-900">
              <UserIcon size={20} />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              {user?.isAvailableForHire && (
                <span className="w-fit px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-green-500/20 animate-pulse">
                  Available for Hire
                </span>
              )}
            </div>
            {user?.location && (
              <p className="text-sm font-bold text-slate-500 flex items-center justify-center md:justify-start gap-1 mb-2">
                <MapPin size={14} className="text-primary-600" /> {user.location}
              </p>
            )}
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md">
              {user?.bio || 'No bio added yet. Tell the community about yourself!'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
              <span className="flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-full">
                <Briefcase size={14} /> {projects.length} Projects
              </span>
              <span className="flex items-center gap-1 px-3 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-600 rounded-full">
                <Heart size={14} /> {savedProjects.length} Saved
              </span>
              {user?.githubLink && (
                <a href={user.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 transition-colors">
                  <Github size={14} /> GitHub
                </a>
              )}
            </div>
          </div>
          <div>
            <Link to="/settings" className="btn-secondary flex items-center gap-2">
              <Settings size={18} /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-0.5">
          <TabButton
            active={activeTab === 'projects'}
            onClick={() => setActiveTab('projects')}
            icon={<Code2 size={18} />}
            label="My Projects"
          />
          <TabButton
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
            icon={<Heart size={18} />}
            label="Saved Projects"
          />
          <TabButton
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            icon={<Hash size={18} />}
            label="Account Settings"
          />
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 glass-card rounded-2xl animate-pulse bg-slate-100 dark:bg-slate-800"></div>
              ))}
            </div>
          ) : activeTab === 'projects' ? (
            projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <ProjectCard key={project._id} project={project} isOwner={true} />
                ))}
                <Link to="/create-project" className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group">
                  <FolderPlus size={48} className="text-slate-400 group-hover:text-primary-500 mb-4" />
                  <span className="text-lg font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary-600">Create New Project</span>
                </Link>
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
                <FolderPlus size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                <p className="text-slate-500 mb-6">Start by showcasing your first awesome project!</p>
                <Link to="/create-project" className="btn-primary">Create Project</Link>
              </div>
            )
          ) : activeTab === 'saved' ? (
            savedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedProjects.map(project => (
                  <ProjectCard key={project._id} project={project} isOwner={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
                <Heart size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">No saved projects</h3>
                <p className="text-slate-500">Projects you like will appear here.</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-enter">
              <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-50/10 border-indigo-500/10 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600">
                    <Bell size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Preferences</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div>
                      <h4 className="font-bold text-sm">Email Notifications</h4>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Updates on likes and comments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={user?.notifications?.email || false} 
                        onChange={(e) => updatePreference('email', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div>
                      <h4 className="font-bold text-sm">Push Notifications</h4>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Real-time alerts in browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={user?.notifications?.push || false} 
                        onChange={(e) => updatePreference('push', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div>
                      <h4 className="font-bold text-sm">Public Profile</h4>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Allow others to see your stats</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={user?.isPublic || false} 
                        onChange={(e) => updatePreference('public', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-[2.5rem] bg-amber-50/10 border-amber-500/10 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Security</h3>
                </div>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all group border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <Download size={18} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                      <span className="font-bold text-sm">Export Account Data</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-300" />
                  </button>
                  <Link to="/settings" className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all group border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <Settings size={18} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                      <span className="font-bold text-sm">Privacy Settings</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-300" />
                  </Link>
                  <button 
                    onClick={() => setShowDeactivateModal(true)}
                    className="w-full mt-4 p-4 text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all border border-dashed border-red-200 dark:border-red-900/30 font-black"
                  >
                    Deactivate My Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeactivateModal(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-red-500/10"
          >
            <button 
              onClick={() => setShowDeactivateModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <X size={20} className="text-slate-400" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-500/10 rounded-3xl text-red-500 mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">Deactivate Account?</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8">
                This action is permanent and cannot be undone. All your projects, likes, and profile data will be permanently removed.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => setShowDeactivateModal(false)}
                  className="py-4 px-6 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-white/5"
                >
                  Keep Account
                </button>
                <button 
                  onClick={handleDeactivate}
                  className="py-4 px-6 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                  Yes, Deactivate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 ${active
        ? 'border-primary-600 text-primary-600'
        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
      }`}
  >
    {icon} {label}
  </button>
);

const ProjectCard = ({ project, isOwner }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/project/${project.slug || project._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden rounded-[2rem] group border-slate-200/50 dark:border-white/5 shadow-lg hover:shadow-primary-500/10 transition-all duration-500"
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={project.images?.[0] || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60'}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {isOwner && (
            <>
              <button className="p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-xl text-slate-600 hover:text-primary-600 transition-all shadow-lg backdrop-blur-md">
                <Edit size={16} />
              </button>
              <button className="p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-xl text-slate-600 hover:text-red-600 transition-all shadow-lg backdrop-blur-md">
                <Trash2 size={16} />
              </button>
            </>
          )}
          <button 
            onClick={handleShare}
            className={`p-2.5 rounded-xl transition-all shadow-lg backdrop-blur-md flex items-center gap-2 ${
              copied ? 'bg-green-500 text-white' : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 hover:text-primary-600'
            }`}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <Link to={`/project/${project.slug || project._id}`}>
            <h3 className="text-xl font-bold line-clamp-1 hover:text-primary-600 transition-colors tracking-tight">{project.title}</h3>
          </Link>
          <div className="flex items-center gap-4 text-slate-500 text-xs font-black">
            <div className="flex items-center gap-1 bg-pink-50 dark:bg-pink-900/10 px-2 py-1 rounded-lg text-pink-500">
              <Heart size={14} className="fill-pink-500" /> {project.likes?.length || 0}
            </div>
            <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/10 px-2 py-1 rounded-lg text-indigo-500">
              <MessageSquare size={14} /> {project.comments?.length || 0}
            </div>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
          {project.description}
        </p>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {project.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] uppercase font-black tracking-widest px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 border border-slate-100 dark:border-white/5">
                {tag}
              </span>
            ))}
          </div>
          <Link to={`/project/${project.slug || project._id}`} className="flex-shrink-0 text-indigo-600 hover:text-indigo-700 font-black text-[10px] uppercase tracking-widest pb-1 border-b-2 border-indigo-600/20 hover:border-indigo-600 transition-all flex items-center gap-1">
            View Project <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
          <div className="flex items-center gap-2">
            {!isOwner && (
              <>
                <Avatar src={project.createdBy?.profileImage} name={project.createdBy?.name} size="xs" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">{project.createdBy?.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-primary-600 transition-all" title="Project Website">
                <Globe size={18} />
              </a>
            )}
            <a href={project.githubRepo} target="_blank" rel="noreferrer" className="btn-secondary py-2 px-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 rounded-xl">
              GitHub <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
