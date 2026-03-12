import { motion } from 'framer-motion';
import { Users, Target, Rocket, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-black mb-6">About DevCollab</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          We're on a mission to bring world's developers together to build amazing things.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="glass-card p-8 rounded-[2.5rem]">
          <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 p-3 rounded-2xl w-fit mb-6">
            <Target size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            To create a transparent, collaborative ecosystem where every developer, regardless of their background, can showcase their skills and contribute to meaningful projects.
          </p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem]">
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 p-3 rounded-2xl w-fit mb-6">
            <Heart size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-4">Our Values</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Community first, transparency, and innovation. We believe that the best software is built when diverse minds work together without barriers.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        <h2 className="text-3xl font-bold text-center">Our Story</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-primary-500 pl-6">
            DevCollab started as a small project by a group of passionate developers who struggled to find collaborators for their side projects. We realized that while GitHub is great for hosting code, it lacks the "social collaboration" aspect for building a community around early-stage ideas.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Today, DevCollab is growing into a global community of creators, thinkers, and builders. Whether you're a junior developer looking for your first project or a senior engineer wanting to mentor others, there's a place for you here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
