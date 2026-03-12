import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, Upload, Github, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { uploadImage } from '../services/upload';
import { useRef } from 'react';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubRepo: '',
    demoLink: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState([]); // Real files
  const [previews, setPreviews] = useState([]); // Preview URLs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { title, description, githubRepo, demoLink, tags } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: tags.filter(tag => tag !== tagToRemove) });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (tags.length === 0) {
      setError('Please add at least one tag');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      // Upload all images to Cloudinary
      let uploadedUrls = [];
      if (images.length > 0) {
        uploadedUrls = await Promise.all(
          images.map(image => uploadImage(image))
        );
      } else {
        // Fallback or error if no images
        uploadedUrls = ['https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60'];
      }

      const projectData = {
        ...formData,
        images: uploadedUrls, 
      };
      
      await API.post('/projects', projectData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 rounded-3xl text-center max-w-lg">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Project Created!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-0">Your masterpiece is now live on DevCollab.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Post a Project</h1>
        <p className="text-slate-600 dark:text-slate-400">Share your work with the global developer community.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
              placeholder="e.g. AI Content Generator"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              rows="5"
              className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm resize-none"
              placeholder="Explain what your project does, the technical stack used, and any challenges you solved..."
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                <Github size={16} /> GitHub Repository
              </label>
              <input
                type="url"
                name="githubRepo"
                value={githubRepo}
                onChange={onChange}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                placeholder="https://github.com/user/repo"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                <LinkIcon size={16} /> Live Demo (Optional)
              </label>
              <input
                type="url"
                name="demoLink"
                value={demoLink}
                onChange={onChange}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                placeholder="https://my-app.vercel.app"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-lg text-sm font-bold">
                  {tag} <X size={14} className="cursor-pointer" onClick={() => removeTag(tag)} />
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
              placeholder="Press Enter to add tags (e.g. React, MongoDB)"
            />
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 block mb-4">Project Images</label>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-video rounded-xl overflow-hidden group">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div 
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            <Upload size={32} className="mx-auto text-slate-300 group-hover:text-primary-500 mb-2" />
            <p className="font-bold text-slate-600 dark:text-slate-300">Add Project Images</p>
            <p className="text-xs text-slate-400 mt-1">Maximum 5 images, up to 2MB each</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl border border-red-100 dark:border-red-900/30">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-8">Cancel</button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary px-12 py-3 text-lg relative"
          >
            {isSubmitting ? 'Creating...' : 'Launch Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
