import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Github, Twitter, Linkedin, Globe, Save, Camera, AlertCircle, MapPin, Briefcase, X, Check } from 'lucide-react';
import API from '../services/api';
import Avatar from '../components/Avatar';
import { getUserProfile, updateUserProfile } from '../redux/slices/userSlice';
import { uploadImage } from '../services/upload';
import { useRef } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
    githubLink: '',
    twitter: '',
    linkedin: '',
    website: '',
    location: '',
    isAvailableForHire: false,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Cropper states
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!profileImage) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(profileImage);
    setPreviewUrl(objectUrl);

    // Free memory when component unmounts or profileImage changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImage]);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setProfileImage(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        const profile = res.data;
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          bio: profile.bio || '',
          skills: profile.skills?.join(', ') || '',
          githubLink: profile.githubLink || '',
          twitter: profile.socialLinks?.twitter || '',
          linkedin: profile.socialLinks?.linkedin || '',
          website: profile.socialLinks?.website || '',
          location: profile.location || '',
          isAvailableForHire: profile.isAvailableForHire || false,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let imageUrl = user?.profileImage;

      if (profileImage) {
        imageUrl = await uploadImage(profileImage);
      }

      const updateData = {
        name: formData.name,
        bio: formData.bio,
        profileImage: imageUrl,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        githubLink: formData.githubLink,
        socialLinks: {
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          website: formData.website,
        },
        location: formData.location,
        isAvailableForHire: formData.isAvailableForHire,
      };

      const result = await dispatch(updateUserProfile(updateData)).unwrap();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // The authSlice matcher will handle updating state.user and localStorage
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading settings...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Image Cropper Modal */}
      <AnimatePresence>
        {showCropper && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Crop Profile Photo</h2>
                  <p className="text-sm text-slate-500 font-medium">Position and zoom your photo to fit the circle.</p>
                </div>
                <button
                  onClick={() => setShowCropper(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative h-[400px] w-full bg-slate-100 dark:bg-slate-950">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCropper(false)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCropSave}
                    className="flex-1 py-4 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} /> Save Crop
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Account Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your profile and presence on DevCollab</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="glass-card p-8 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center bg-primary-50/10 border-primary-500/10">
          <div className="relative group">
            <Avatar
              src={previewUrl || user?.profileImage}
              name={user?.name}
              size="xl"
              className="ring-4 ring-primary-500 ring-offset-4 ring-offset-white dark:ring-offset-slate-900 shadow-2xl transition-all group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 p-3 bg-primary-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"
            >
              <Camera size={20} />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-1">Profile Photo</h3>
            <p className="text-sm text-slate-500 mb-4">Click the icon to upload a new profile picture. Recommended size: 400x400px.</p>
            <div className="flex gap-2 justify-center md:justify-start">
              <button
                type="button"
                onClick={() => {
                  setProfileImage(null);
                  setPreviewUrl(null);
                }}
                className="btn-secondary px-4 py-1.5 text-xs"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-xs font-bold text-primary-600 ml-2 hover:underline"
              >
                Upload New
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-l-4 border-primary-600 pl-4">Personal Info</h2>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Email (Read Only)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Short Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={onChange}
                rows="4"
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="Brief description about yourself..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary-50/30 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-800/20">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl text-primary-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Available for Hire</h4>
                  <p className="text-xs text-slate-500 font-medium">Show a badge on your profile</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailableForHire}
                  onChange={(e) => setFormData({ ...formData, isAvailableForHire: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold border-l-4 border-primary-600 pl-4">Work & Social</h2>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={onChange}
                className="w-full px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="React, Node.js, Python..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">GitHub Profile</label>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Twitter</label>
                <div className="relative">
                  <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={onChange}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={onChange}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Personal Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}
          >
            <AlertCircle size={20} />
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-10 py-4 text-lg flex items-center gap-2 shadow-xl shadow-primary-500/20"
          >
            {saving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
