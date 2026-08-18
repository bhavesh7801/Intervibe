import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Globe, Server, Database } from 'lucide-react';

export const SystemDesignPreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-t border-[#162035]/60 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-[#080d1a] border border-blue-500/20 p-5 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">
          
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">SYSTEM DESIGN CANVAS</span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
              Master High-Level System Architecture
            </h2>
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed sm:leading-loose">
              Practice whiteboard design loops for distributed databases, load balancers, caching layers, and microservices with instant AI architecture feedback.
            </p>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                <span>Interactive node topology canvas with drag-and-drop connections</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                <span>p99 latency bottleneck calculation & throughput stress tests</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                <span>Real-time feedback on single-points-of-failure (SPOF)</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/system-design')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer group hover:scale-[1.03] active:scale-95 text-center"
            >
              <span>Explore System Design Canvas</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* System Architecture Blueprint Visual */}
          <div className="lg:col-span-7">
            <div className="p-4 sm:p-7 rounded-2xl bg-[#05070e] border border-[#162035] space-y-4 sm:space-y-5 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-[#162035] text-slate-400 gap-2">
                <span className="text-blue-300 font-bold text-xs sm:text-sm">Topology: Global Financial Gateway</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto text-[11px]">
                  1M QPS Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#0e121f] border border-blue-500/30 text-center space-y-2">
                  <Globe size={22} className="mx-auto text-blue-400" />
                  <div className="font-bold text-white text-xs">Cloudflare CDN</div>
                  <div className="text-[10px] text-slate-400">Edge Caching</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0e121f] border border-cyan-500/30 text-center space-y-2">
                  <Server size={22} className="mx-auto text-cyan-400" />
                  <div className="font-bold text-white text-xs">NGINX Gateway</div>
                  <div className="text-[10px] text-slate-400">Load Balancer</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0e121f] border border-indigo-500/30 text-center space-y-2">
                  <Database size={22} className="mx-auto text-indigo-400" />
                  <div className="font-bold text-white text-xs">Redis Cluster</div>
                  <div className="text-[10px] text-slate-400">&lt; 2ms Latency</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};
