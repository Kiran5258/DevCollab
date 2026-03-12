import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary-600 p-2 rounded-xl">
                <img src="/favicon.png" alt="DevCollab" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                DevCollab
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The ultimate collaboration platform for modern developers to showcase projects and build the future together.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-400 hover:text-primary-600 transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-400 hover:text-primary-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-400 hover:text-primary-600 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/explore" className="text-slate-500 hover:text-primary-600">Explore Projects</Link></li>
              <li><Link to="/create-project" className="text-slate-500 hover:text-primary-600">Post a Project</Link></li>
              <li><Link to="/dashboard" className="text-slate-500 hover:text-primary-600">Developer Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/about" className="text-slate-500 hover:text-primary-600">About Us</Link></li>
              <li><Link to="/careers" className="text-slate-500 hover:text-primary-600">Careers</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-primary-600">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/privacy" className="text-slate-500 hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-500 hover:text-primary-600">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-slate-500 hover:text-primary-600">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} DevCollab. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <Link to="/help" className="hover:text-primary-600 transition-colors">Help Center</Link>
            <Link to="/status" className="hover:text-primary-600 transition-colors">System Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
