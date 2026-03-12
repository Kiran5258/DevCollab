import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Globe, Twitter, Linkedin, Briefcase, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';
import API from '../services/api';
import Avatar from '../components/Avatar';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setProfile(res.data.user);
        setProjects(res.data.projects);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">User not found</h2>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-8 rounded-[2rem] sticky top-24">
            <Avatar 
              src={profile.profileImage} 
              name={profile.name} 
              size="2xl" 
              className="mx-auto mb-6 border-4 border-white dark:border-slate-800 shadow-2xl rounded-[2.5rem]"
            />
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
              <p className="text-slate-500 font-medium">Full Stack Developer</p>
            </div>

            <div className="space-y-4 mb-8">
              {profile.location && (
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <MapPin size={18} /> <span>{profile.location}</span>
                </div>
              )}
              {profile.isAvailableForHire && (
                <div className="flex items-center gap-3 text-green-600 font-bold">
                  <Briefcase size={18} /> <span>Available for Hire</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail size={18} /> <span>{profile.email}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.length > 0 ? profile.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                )) : <span className="text-slate-400 text-sm">No skills added</span>}
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {profile.githubLink && (
                <a href={profile.githubLink} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-primary-600 transition-colors">
                  <Github size={20} />
                </a>
              )}
              {profile.socialLinks?.twitter && (
                 <a href={profile.socialLinks.twitter} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-primary-600 transition-colors">
                  <Twitter size={20} />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                 <a href={profile.socialLinks.linkedin} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-primary-600 transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
              {profile.socialLinks?.website && (
                 <a href={profile.socialLinks.website} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-primary-600 transition-colors">
                  <Globe size={20} />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Bio and Projects */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="glass-card p-8 rounded-[2rem]">
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              {profile.bio || "I'm a passionate developer who loves building innovative solutions and collaborating with others. Currently focused on modern web technologies and building scalable applications."}
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold px-2">Projects ({projects.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={project._id}
                  className="glass-card overflow-hidden rounded-[1.5rem]"
                >
                  <img src={project.images?.[0]} className="h-44 w-full object-cover" alt="" />
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Heart size={14} className="fill-slate-400" /> {project.likes?.length}
                      </div>
                      <a href={project.githubRepo} className="text-primary-600 text-sm font-bold flex items-center gap-1">
                        View Code <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
