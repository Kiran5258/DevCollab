import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Heart, MessageSquare, Calendar, ChevronLeft, Share2, AlertCircle, Send, Trash2 } from 'lucide-react';
import API from '../services/api';
import Avatar from '../components/Avatar';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [replyTo, setReplyTo] = useState(null); // ID of comment being replied to
  const [replyText, setReplyText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/projects/${id}`);
        setProject(res.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert('Please login to like projects');
    if (isLiking) return;

    setIsLiking(true);
    try {
      const res = await API.put(`/projects/${id}/like`);
      setProject({ ...project, likes: res.data });
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');
    if (!comment.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const res = await API.post(`/projects/${id}/comment`, { text: comment });
      setProject({ ...project, comments: res.data });
      setComment('');
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await API.delete(`/projects/${id}/comment/${commentId}`);
      setProject({ ...project, comments: res.data });
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const likeComment = async (commentId) => {
    if (!user) return alert('Please login to like comments');
    try {
      const res = await API.put(`/projects/${id}/comment/${commentId}/like`);
      const updatedComments = project.comments.map(c => 
        c._id === commentId ? { ...c, likes: res.data } : c
      );
      setProject({ ...project, comments: updatedComments });
    } catch (error) {
      console.error('Comment like error:', error);
    }
  };

  const handleReply = async (commentId) => {
    if (!user) return alert('Please login to reply');
    if (!replyText.trim()) return;

    try {
      const res = await API.post(`/projects/${id}/comment/${commentId}/reply`, { text: replyText });
      const updatedComments = project.comments.map(c => 
        c._id === commentId ? { ...c, replies: res.data } : c
      );
      setProject({ ...project, comments: updatedComments });
      setReplyText('');
      setReplyTo(null);
    } catch (error) {
      console.error('Reply error:', error);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!project) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">Project not found</h2>
      <Link to="/explore" className="text-primary-600 hover:underline mt-4 inline-block">Back to Explore</Link>
    </div>
  );

  const isLiked = user && project.likes?.includes(user._id);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link to="/explore" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 font-medium transition-colors">
        <ChevronLeft size={20} /> Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Main Card */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl glass"
            >
              <img src={project.images?.[0] || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60'} alt={project.title} className="w-full object-cover max-h-[500px]" />
            </motion.div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-extrabold">{project.title}</h1>
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                    isLiked 
                      ? 'bg-pink-500 text-white shadow-pink-500/20' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 hover:bg-pink-50 dark:hover:bg-pink-900/10'
                  }`}
                >
                  <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                  {project.likes?.length || 0}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.tags?.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-xl text-sm font-bold">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-8 border-t border-slate-200 dark:border-slate-800 pt-12">
            <h2 className="text-2xl font-extrabold flex items-center gap-3">
              <MessageSquare className="text-primary-600" />
              Community Feedback ({project.comments?.length || 0})
            </h2>

            {user ? (
              <form onSubmit={handleComment} className="relative group">
                <img 
                  src={user.profileImage} 
                  className="absolute left-4 top-4 w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
                  alt=""
                />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts on this project..."
                  className="w-full pl-16 pr-24 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all resize-none h-24"
                />
                <button
                  type="submit"
                  disabled={isCommenting || !comment.trim()}
                  className="absolute right-4 bottom-4 btn-primary py-2 px-6 rounded-2xl flex items-center gap-2 text-sm disabled:opacity-50 disabled:grayscale transition-all"
                >
                  <Send size={16} /> 
                  {isCommenting ? 'Posting...' : 'Post'}
                </button>
              </form>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 mb-4">You must be logged in to join the conversation.</p>
                <Link to="/login" className="btn-primary">Login Now</Link>
              </div>
            )}

            <div className="space-y-6">
              {project.comments?.map((c, index) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <Avatar src={c.user?.profileImage} name={c.user?.name} size="md" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mr-2">{c.user?.name}</span>
                        <span className="text-xs text-slate-400 font-medium">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line mb-4">
                      {c.text}
                    </p>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => likeComment(c._id)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                          c.likes?.includes(user?._id) ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'
                        }`}
                      >
                        <Heart size={14} className={c.likes?.includes(user?._id) ? 'fill-current' : ''} />
                        {c.likes?.length || 0}
                      </button>
                      <button 
                        onClick={() => setReplyTo(replyTo === c._id ? null : c._id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors"
                      >
                        <MessageSquare size={14} />
                        Reply
                      </button>
                      {(user?._id === c.user?._id || user?.role === 'admin' || user?._id === project.createdBy?._id) && (
                        confirmDeleteId === c._id ? (
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500/80 mr-1 animate-pulse">Confirm?</span>
                            <button 
                              onClick={() => deleteComment(c._id)}
                              className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                            >
                              Yes
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmDeleteId(c._id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all ml-auto border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        )
                      )}
                    </div>

                    {/* Reply Input */}
                    <AnimatePresence>
                      {replyTo === c._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800"
                        >
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                            <button 
                              onClick={() => handleReply(c._id)}
                              disabled={!replyText.trim()}
                              className="btn-primary py-2 px-4 rounded-xl text-xs disabled:opacity-50"
                            >
                              Reply
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Nested Replies */}
                    {c.replies?.length > 0 && (
                      <div className="mt-4 space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                        {c.replies.map(reply => (
                          <div key={reply._id} className="flex gap-3">
                            <Avatar src={reply.user?.profileImage} name={reply.user?.name} size="xs" />
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold">{reply.user?.name}</span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {project.comments?.length === 0 && (
                <div className="text-center py-8 text-slate-400 font-medium italic">
                  No comments yet. Be the first to start the conversation!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 rounded-[2rem] sticky top-24"
          >
            <div className="flex items-center gap-4 mb-8">
              <Avatar src={project.createdBy?.profileImage} name={project.createdBy?.name} size="lg" className="rounded-2xl" />
              <div>
                <h3 className="font-bold">{project.createdBy?.name}</h3>
                <Link to={`/profile/${project.createdBy?._id}`} className="text-sm text-primary-600 hover:underline">View Profile</Link>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Calendar size={16} /> Created</span>
                <span className="font-semibold">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Heart size={16} /> Likes</span>
                <span className="font-semibold">{project.likes?.length || 0}</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <a href={project.githubRepo} target="_blank" rel="noreferrer" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                <Github size={20} /> View Github
              </a>
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noreferrer" className="btn-secondary w-full flex items-center justify-center gap-2 py-3">
                  <ExternalLink size={20} /> Live Demo
                </a>
              )}
              <button className="w-full flex items-center justify-center gap-2 py-3 text-slate-500 hover:text-primary-600 font-bold transition-colors">
                <Share2 size={20} /> Share Project
              </button>
            </div>

            <div className="p-4 rounded-2xl border-2 border-primary-500/20 bg-primary-50/10 dark:bg-primary-900/10">
              <div className="flex gap-3 text-primary-600">
                <AlertCircle size={24} className="flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Contribute?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">This dev is looking for collaborators. Reach out via GitHub!</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
