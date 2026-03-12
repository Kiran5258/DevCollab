import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-black mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-slate-500 font-medium">Last Updated: March 12, 2026</p>
      </motion.div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 font-black italic border-b-2 border-primary-500/20 pb-2">1. Agreement to Terms</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            By accessing or using DevCollab, you agree to be bound by these Terms of Service. If you do not agree to all these terms, do not use our platform. These terms apply to all visitors, users, and others who access the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 font-black italic border-b-2 border-primary-500/20 pb-2">2. User Conduct</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-4">
            You are responsible for your use of the platform and for any content you provide. You agree that you will not:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
            <li>Post any content that is unlawful, harmful, or defamatory.</li>
            <li>Impersonate any person or entity.</li>
            <li>Use the platform for any unauthorized or illegal purpose.</li>
            <li>Attempt to gain unauthorized access to our systems.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 font-black italic border-b-2 border-primary-500/20 pb-2">3. Intellectual Property</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            The service and its original content (excluding content provided by users), features and functionality are and will remain the exclusive property of DevCollab. Our trademarks may not be used in connection with any product or service without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 font-black italic border-b-2 border-primary-500/20 pb-2">4. Termination</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
