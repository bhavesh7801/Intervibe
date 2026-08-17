import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Legal = () => {
  return (
    <div className="min-h-screen bg-[#060813] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-300 mb-12">
          Legal & Privacy Policy
        </h1>

        <div className="space-y-12 text-slate-300 leading-relaxed">
          <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">1. Data Processing & Privacy</h2>
            <p className="mb-4">
              Your privacy is our absolute priority. When you use the Mock Interview feature, we temporarily process your audio and video strictly for the purpose of generating AI feedback and transcriptions.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong>Audio/Video Data:</strong> Processed dynamically in-memory and never permanently stored on our servers.</li>
              <li><strong>Resume Data:</strong> Used exclusively to tailor your interview questions. We do not sell, share, or use your resume for any external marketing.</li>
              <li><strong>Telemetry:</strong> We track anonymous usage statistics (like questions solved and streaks) solely to improve your dashboard experience.</li>
            </ul>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">2. Terms of Service</h2>
            <p className="mb-4">
              By using our platform, you agree to not abuse our AI generation endpoints. 
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Accounts found utilizing automated bots to scrape questions or burn AI credits will be permanently banned.</li>
              <li>You are responsible for keeping your account credentials secure.</li>
              <li>The AI feedback is intended for educational purposes and does not guarantee job placement.</li>
            </ul>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">3. Credits & Usage</h2>
            <p className="text-slate-400">
              New accounts are provided with complimentary credits to try the platform. Once these are exhausted, generation of further mock interviews is restricted. Unused credits do not roll over or have monetary value.
            </p>
          </section>
        </div>
        
        <div className="mt-16 text-center text-slate-500 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default Legal;
