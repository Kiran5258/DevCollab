import { motion } from 'framer-motion';
import { ArrowRight, Code2, Users, Rocket, Zap, Github, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 flex items-center justify-center min-h-[90vh]">
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-6 relative z-10 text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary-500/30 text-primary-600 font-medium mb-6">
            <Zap size={16} />
            <span>The ultimate platform for modern developers</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Showcase your Projects. <br />
            <span className="gradient-text">Collaborate</span> with the Best.
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            DevCollab is the centralized hub for developers to build profiles, share their side projects, and connect with other talented creators.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-3">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link to="/explore" className="btn-secondary flex items-center gap-2 text-lg px-8 py-3">
              Explore Projects
            </Link>
          </motion.div>

          {/* Floating UI Elements Mockup */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="glass shadow-2xl rounded-2xl p-4 md:p-8 animate-float">
              <div className="flex gap-4 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card rounded-xl p-6 h-48 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                      <Code2 className="text-primary-600" />
                    </div>
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded mb-1"></div>
                    <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why choose DevCollab?</h2>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to grow your developer career.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="text-blue-500" />}
              title="Global Visibility"
              description="Your projects are seen by developers and recruiters worldwide. Build your reputation."
            />
            <FeatureCard
              icon={<Users className="text-purple-500" />}
              title="Collaborative Environment"
              description="Find contributors for your open source projects or join exciting new ventures."
            />
            <FeatureCard
              icon={<Rocket className="text-orange-500" />}
              title="Rapid Growth"
              description="Get feedback from the community and improve your skills by seeing others' work."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard count="10K+" label="Developers" />
            <StatCard count="25K+" label="Projects" />
            <StatCard count="50K+" label="Collaborations" />
            <StatCard count="100+" label="Countries" />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="glass-card p-8 rounded-2xl border-none shadow-sm"
  >
    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
);

const StatCard = ({ count, label }) => (
  <div className="p-4">
    <div className="text-4xl font-extrabold text-primary-600 mb-2">{count}</div>
    <div className="text-slate-600 dark:text-slate-400 font-medium">{label}</div>
  </div>
);

export default Home;
