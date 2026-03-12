import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-black mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 font-medium">Last Updated: March 12, 2026</p>
      </motion.div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            Welcome to DevCollab. We respect your privacy and want to protect your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. The Data We Collect</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-4">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and social media handles.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
            <li><strong>Profile Data</strong> includes your username and password, interests, preferences, feedback and survey responses.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. How We Use Your Data</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            - Where we need to perform the contract we are about to enter into or have entered into with you.
            - Where it is necessary for our legitimate interests (or those of a third party).
            - Where we need to comply with a legal obligation.
          </p>
        </section>

        <section className="p-8 bg-primary-50 dark:bg-primary-900/10 rounded-[2rem] border border-primary-100 dark:border-primary-800/20">
          <h2 className="text-xl font-bold mb-4">Questions?</h2>
          <p className="text-slate-600 dark:text-slate-400">
            If you have any questions about this privacy policy, please contact our support team at <a href="mailto:privacy@devcollab.com" className="text-primary-600 font-bold underline">privacy@devcollab.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
