import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Hash, MessageSquare, Plus, Search, ChevronRight, Info } from 'lucide-react';
import API from '../services/api';
import Avatar from '../components/Avatar';

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  
  const scrollRef = useRef();

  // Fetch all channels
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await API.get('/chats/channels');
        setChannels(res.data);
        if (res.data.length > 0 && !activeChannel) {
          setActiveChannel(res.data[0]);
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  // Fetch messages for active channel
  useEffect(() => {
    if (!activeChannel) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chats/${activeChannel._id}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChannel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannel) return;

    try {
      const res = await API.post(`/chats/${activeChannel._id}`, { text: newMessage });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Send error:', error);
    }
  };

  const createHub = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const res = await API.post('/chats/channels', { 
        name: newChannelName, 
        description: newChannelDesc 
      });
      setChannels([...channels, res.data]);
      setActiveChannel(res.data);
      setShowCreateModal(false);
      setNewChannelName('');
      setNewChannelDesc('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating hub');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-100px)]">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-100px)] max-w-7xl">
      <div className="glass-card rounded-[2.5rem] h-full flex overflow-hidden bg-white/50 dark:bg-slate-950/50 shadow-2xl">
        
        {/* Hubs Sidebar */}
        <div className="w-20 md:w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="hidden md:block font-black text-xl tracking-tight uppercase">Hubs</h2>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="p-2 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-1">
            {channels.map((ch) => (
              <button
                key={ch._id}
                onClick={() => setActiveChannel(ch)}
                className={`w-full px-4 md:px-6 py-4 flex items-center gap-4 transition-all relative ${
                  activeChannel?._id === ch._id 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {activeChannel?._id === ch._id && (
                  <motion.div layoutId="activeHub" className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-600 rounded-r-full" />
                )}
                <div className={`p-2 rounded-xl ${activeChannel?._id === ch._id ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <Hash size={18} />
                </div>
                <div className="hidden md:block text-left overflow-hidden">
                  <p className={`font-bold truncate ${activeChannel?._id === ch._id ? 'text-slate-900 dark:text-white' : ''}`}>
                    {ch.name}
                  </p>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-60">HUB-CHAN-{ch.name.slice(0,3)}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 hidden md:block">
            <div className="flex items-center gap-3">
              <Avatar src={user?.profileImage} name={user?.name} size="sm" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Online Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/40 dark:bg-slate-950/20 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeChannel ? (
              <motion.div
                key={activeChannel._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-500/20"
                    >
                      <Hash size={24} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                        {activeChannel.name}
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">Public</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium italic">{activeChannel.description || 'Welcome to the hub!'}</p>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Collaborators</p>
                      <p className="text-sm font-black text-primary-600">Active Discussion</p>
                    </div>
                    <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all">
                      <Info size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center border-b border-slate-100 dark:border-slate-800 mb-8"
                  >
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center text-primary-600 mb-4">
                      <Hash size={32} />
                    </div>
                    <h4 className="text-xl font-bold">Welcome to #{activeChannel.name}</h4>
                    <p className="text-sm max-w-xs mx-auto">This is the start of the #{activeChannel.name} discussion. Start collaborating!</p>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                      const isMe = msg.user?._id === user?._id;
                      return (
                        <motion.div
                          key={msg._id}
                          layout
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <Avatar src={msg.user?.profileImage} name={msg.user?.name} size="md" className="shadow-xl" />
                          <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className="flex items-center gap-3 mb-1.5 px-2">
                              {!isMe && <span className="text-xs font-black text-slate-900 dark:text-white">{msg.user?.name}</span>}
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className={`px-6 py-4 rounded-[1.8rem] shadow-sm text-sm font-medium ${
                              isMe 
                                ? 'bg-primary-600 text-white rounded-tr-none' 
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <div className="relative group">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message #${activeChannel.name}...`}
                      className="w-full pl-8 pr-20 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3.5 bg-primary-600 text-white rounded-2xl shadow-xl hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    >
                      <Send size={24} />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-8">
                  <MessageSquare size={48} />
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Select a Hub</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Join a discussion or create your own hub to start collaborating with other developers.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Hub Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10"
            >
              <h2 className="text-3xl font-black mb-2 tracking-tight">Create New Hub</h2>
              <p className="text-slate-500 text-sm mb-8">Hubs are where your community is built. Make it special!</p>
              
              <form onSubmit={createHub} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Hub Name</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-600 font-black text-xl">#</span>
                    <input 
                      type="text" 
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      placeholder="react-next-chat"
                      className="w-full pl-10 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description (Optional)</label>
                  <textarea 
                    value={newChannelDesc}
                    onChange={(e) => setNewChannelDesc(e.target.value)}
                    placeholder="What is this hub about?"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium resize-none h-24"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all"
                  >
                    Launch Hub
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
