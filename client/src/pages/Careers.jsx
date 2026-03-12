import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';

const Careers = () => {
  const jobs = [
    { title: "Senior Frontend Engineer", location: "Remote", type: "Full-time", salary: "$120k - $160k" },
    { title: "Product Designer", location: "Remote / Hybrid", type: "Full-time", salary: "$90k - $130k" },
    { title: "Backend Developer (Node.js)", location: "Remote", type: "Contract", salary: "$80/hr" },
  ];

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-bold mb-4 inline-block tracking-tighter">WE ARE HIRING</span>
        <h1 className="text-5xl font-black mb-6">Build the Future of Dev Experience</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Join our small, fully remote team and help us build the next generation of developer tools.
        </p>
      </motion.div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
        {jobs.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary-500/50 transition-all cursor-pointer group"
          >
            <div>
              <h3 className="text-xl font-bold group-hover:text-primary-600 transition-colors">{job.title}</h3>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} /> {job.type}</span>
                <span className="flex items-center gap-1.5"><DollarSign size={16} /> {job.salary}</span>
              </div>
            </div>
            <button className="btn-primary py-2 px-6 rounded-2xl text-sm whitespace-nowrap">Apply Now</button>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 glass-card p-12 rounded-[2.5rem] bg-slate-950 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Don't see a fit?</h3>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
          We're always looking for talented developers, designers, and community managers. Send us your portfolio and let's chat!
        </p>
        <button className="px-8 py-3 bg-white text-slate-950 rounded-2xl font-bold hover:scale-105 transition-transform">Send Open Application</button>
      </div>
    </div>
  );
};

export default Careers;
