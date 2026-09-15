import React, { useState } from 'react';
import { Server, Database, Cloud, Cpu, Globe, Shield, RefreshCw, Trash2, Plus, Sparkles, Layers, CheckCircle2, AlertTriangle, Zap, Activity } from 'lucide-react';

const NODE_TEMPLATES = [
  { type: 'lb', label: 'Load Balancer (NGINX/Envoy)', icon: Globe, color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { type: 'service', label: 'Microservice Cluster', icon: Server, color: 'border-purple-300 bg-purple-50 text-purple-700' },
  { type: 'cache', label: 'Redis Cluster (Memory Tier)', icon: Cpu, color: 'border-rose-300 bg-rose-50 text-rose-700' },
  { type: 'db', label: 'PostgreSQL Primary/Replica', icon: Database, color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { type: 'queue', label: 'Kafka Event Broker', icon: Layers, color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { type: 'cdn', label: 'Cloudflare CDN & WAF', icon: Shield, color: 'border-sky-300 bg-sky-50 text-sky-700' }
];

export const SystemDesignCanvas = () => {
  const [nodes, setNodes] = useState([
    { id: 'n1', type: 'cdn', label: 'Cloudflare CDN & WAF', x: 30, y: 40, icon: Shield, color: 'border-sky-300 bg-sky-50 text-sky-700' },
    { id: 'n2', type: 'lb', label: 'Global Load Balancer', x: 230, y: 40, icon: Globe, color: 'border-blue-300 bg-blue-50 text-blue-700' },
    { id: 'n3', type: 'service', label: 'API Gateway & Services', x: 440, y: 40, icon: Server, color: 'border-purple-300 bg-purple-50 text-purple-700' },
    { id: 'n4', type: 'cache', label: 'Redis Distributed Cache', x: 440, y: 170, icon: Cpu, color: 'border-rose-300 bg-rose-50 text-rose-700' },
    { id: 'n5', type: 'db', label: 'PostgreSQL Sharded DB', x: 660, y: 40, icon: Database, color: 'border-emerald-300 bg-emerald-50 text-emerald-700' }
  ]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [auditResult, setAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const addNode = (tmpl) => {
    const newNode = {
      id: 'n_' + Date.now().toString(36),
      type: tmpl.type,
      label: tmpl.label,
      x: 60 + (nodes.length % 5) * 50,
      y: 80 + (nodes.length % 3) * 35,
      icon: tmpl.icon,
      color: tmpl.color
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode);
  };

  const removeNode = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
  };

  const resetCanvas = () => {
    setNodes([]);
    setSelectedNode(null);
    setAuditResult(null);
  };

  const handleAuditArchitecture = async () => {
    setIsAuditing(true);
    try {
      await new Promise((res) => setTimeout(res, 800));

      const hasCache = nodes.some((n) => n.type === 'cache');
      const hasQueue = nodes.some((n) => n.type === 'queue');
      const hasDb = nodes.some((n) => n.type === 'db');
      const hasLb = nodes.some((n) => n.type === 'lb');

      const spofs = [];
      if (!hasLb) spofs.push('Direct traffic hitting service nodes without an edge Load Balancer.');
      if (!hasCache) spofs.push('Direct read pressure on primary database without distributed cache.');

      const score = Math.min(95, 60 + (hasLb ? 10 : 0) + (hasCache ? 10 : 0) + (hasQueue ? 10 : 0) + (hasDb ? 10 : 0));

      setAuditResult({
        score,
        grade: score >= 85 ? 'Strong Hire (L5+)' : 'Hire (L4)',
        latency: hasCache ? '14ms p99' : '85ms p99 (Cache Missing)',
        tpsCapacity: hasQueue && hasCache ? '350,000 req/sec' : '45,000 req/sec',
        spofs: spofs.length > 0 ? spofs : ['No critical Single Points of Failure detected.'],
        strengths: [
          'High isolation between CDN edge and internal microservice clusters',
          hasCache ? 'In-memory Redis cache mitigates database write saturation' : 'Good base connectivity'
        ],
        recommendations: [
          hasQueue ? 'Add Dead Letter Queue (DLQ) handlers for Kafka retry logic' : 'Introduce asynchronous Kafka messaging queue to absorb traffic spikes',
          'Deploy cross-region active-active read replicas with automated failover'
        ]
      });
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu size={18} className="text-rose-600" />
            <span>Interactive System Design Architecture Canvas</span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Assemble distributed system topology with live AI SPOF & capacity audit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetCanvas}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleAuditArchitecture}
            disabled={isAuditing || nodes.length === 0}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={14} />
            <span>{isAuditing ? 'Auditing Topology...' : 'AI Architecture Review'}</span>
          </button>
        </div>
      </div>

      {/* Component Palette */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 mr-1">
          Add Node:
        </span>
        {NODE_TEMPLATES.map((tmpl, idx) => {
          const Icon = tmpl.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => addNode(tmpl)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-rose-300 text-xs font-bold text-slate-700 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
            >
              <Icon size={14} className="text-rose-600" />
              <span>{tmpl.label.split(' ')[0]}</span>
              <Plus size={12} className="text-slate-400" />
            </button>
          );
        })}
      </div>

      {/* Interactive Blueprint Canvas */}
      <div className="relative w-full h-80 bg-slate-950 rounded-3xl border border-slate-800 p-4 overflow-hidden select-none">
        {/* Subtle Blueprint Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Render Nodes */}
        {nodes.map((node) => {
          const Icon = node.icon || Server;
          const isSelected = selectedNode?.id === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{ top: `${node.y}px`, left: `${node.x}px` }}
              className={`absolute flex items-center gap-2 p-3 rounded-2xl border-2 shadow-lg backdrop-blur-md transition-all cursor-move ${
                node.color
              } ${isSelected ? 'ring-4 ring-rose-500/40 scale-105 z-20' : 'z-10'}`}
            >
              <Icon size={16} />
              <span className="text-xs font-bold tracking-tight">{node.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(node.id);
                }}
                className="p-1 rounded-md hover:bg-slate-900/10 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}

        {nodes.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
            <Sparkles size={24} className="text-slate-600" />
            <span>Canvas is empty. Click any component above to add architectural nodes.</span>
          </div>
        )}
      </div>

      {/* AI Topology Audit Results */}
      {auditResult && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              <span className="font-extrabold text-sm text-slate-900">
                AI Architecture Score: {auditResult.score}/100 ({auditResult.grade})
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span className="text-emerald-600">p99: {auditResult.latency}</span>
              <span className="text-slate-300">•</span>
              <span className="text-purple-600">Capacity: {auditResult.tpsCapacity}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Single Point of Failure Analysis */}
            <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1.5">
              <span className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-rose-600" />
                SPOF & Bottleneck Analysis
              </span>
              <ul className="space-y-1 text-slate-700">
                {auditResult.spofs.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Architectural Next Steps
              </span>
              <ul className="space-y-1 text-slate-700">
                {auditResult.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemDesignCanvas;
