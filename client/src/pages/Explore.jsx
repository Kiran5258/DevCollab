import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, TrendingUp, Clock, Star, ExternalLink, Heart, MessageSquare, Share2, Check, Globe } from 'lucide-react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/projects?sort=${sortBy}`);
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [sortBy]);

  useEffect(() => {
    let result = projects;
    if (searchTerm) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filter === 'liked') {
      result = result.filter(project => project.likes?.includes(user?._id));
    } else if (filter !== 'all') {
      result = result.filter(project => project.tags.includes(filter));
    }
    setFilteredProjects(result);
  }, [searchTerm, filter, projects, user?._id]);

  const handleLike = async (projectId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await API.put(`/projects/${projectId}/like`);
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project._id === projectId ? { ...project, likes: res.data } : project
        )
      );
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 animate-enter">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none gradient-text">
            Discover <br /> The Future
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-xl">
            Explore a curated collection of innovative projects built by our global community of world-class developers.
          </p>
        </div>
       <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, tag, or description..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-medium"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tags</option>
            {user && <option value="liked">❤️ Liked by You</option>}
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="Python">Python</option>
            <option value="Machine Learning">Machine Learning</option>
          </select>
          <select 
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 shadow-sm font-medium"
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="newest">Newest First</option>
            <option value="trending">Trending (Most Hyped)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[400px] glass-card rounded-3xl animate-pulse bg-slate-100 dark:bg-slate-800"></div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={project._id}
              className="glass-card flex flex-col h-full rounded-[2.5rem] overflow-hidden group"
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src={project.images?.[0] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                  <Link to={`/project/${project.slug || project._id}`} className="btn-primary w-full text-center py-4 text-sm uppercase font-black tracking-widest">
                    View Project
                  </Link>
                </div>
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <ShareButton project={project} />
                </div>
                <div className="absolute top-6 left-6">
                  <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {project.status === 'active' ? '● Live' : 'Archived'}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <Avatar src={project.createdBy?.profileImage} name={project.createdBy?.name} size="sm" className="ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">{project.createdBy?.name}</span>
                </div>
                
                <Link to={`/project/${project.slug || project._id}`}>
                  <h3 className="text-2xl font-black mb-3 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{project.title}</h3>
                </Link>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                <div className="mt-auto space-y-8">
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                    <div className="flex items-center gap-6">
                      <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleLike(project._id)}
                        className={`flex items-center gap-2 transition-all p-2 rounded-xl group/like ${
                          project.likes?.includes(user?._id) 
                            ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/10' 
                            : 'text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/10'
                        }`}
                      >
                        <Heart 
                          size={20} 
                          className={`${project.likes?.includes(user?._id) ? 'fill-pink-500 scale-110' : 'group-hover/like:fill-pink-500/20'} transition-all`} 
                        />
                        <span className="text-xs font-black">{project.likes?.length || 0}</span>
                      </motion.button>
                     <div className="flex items-center gap-2 text-slate-400 group/msg">
                        <MessageSquare size={20} className="group-hover/msg:text-indigo-500 transition-all" />
                        <span className="text-xs font-black">{project.comments?.length || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.demoLink && (
                        <a href={project.demoLink} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all shadow-sm" title="Project Website">
                          <Globe size={20} />
                        </a>
                      )}
                      <a href={project.githubRepo} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <ExternalLink size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem]">
          <Search size={64} className="mx-auto text-slate-300 mb-6" />
          <h2 className="text-3xl font-bold mb-2">No projects found</h2>
          <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

const ShareButton = ({ project }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/project/${project.slug || project._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleShare}
      className={`p-3 rounded-2xl transition-all shadow-xl backdrop-blur-md border border-white/20 flex items-center justify-center ${
        copied ? 'bg-green-500 text-white' : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 hover:text-primary-600'
      }`}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
    </button>
  );
};

export default Explore;
