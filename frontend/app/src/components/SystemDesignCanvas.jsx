import React, { useState, useRef } from 'react';
import { Server, Database, Layers, Cpu, HardDrive, RefreshCw, Trash2, Download, Plus, ArrowRight, Shield } from 'lucide-react';

const NODE_TYPES = [
  { type: 'service', label: 'Microservice', icon: Server, color: 'border-blue-500/50 bg-blue-500/10 text-blue-400' },
  { type: 'load_balancer', label: 'Load Balancer', icon: Layers, color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' },
  { type: 'database', label: 'Database', icon: Database, color: 'border-purple-500/50 bg-purple-500/10 text-purple-400' },
  { type: 'cache', label: 'Redis Cache', icon: Cpu, color: 'border-amber-500/50 bg-amber-500/10 text-amber-400' },
  { type: 'queue', label: 'Kafka Queue', icon: HardDrive, color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
];

const SystemDesignCanvas = () => {
  const [nodes, setNodes] = useState([
    { id: '1', type: 'load_balancer', label: 'API Gateway', x: 50, y: 140 },
    { id: '2', type: 'service', label: 'Auth Service', x: 220, y: 80 },
    { id: '3', type: 'service', label: 'Payment API', x: 220, y: 200 },
    { id: '4', type: 'database', label: 'PostgreSQL DB', x: 390, y: 140 },
  ]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [connections, setConnections] = useState([
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '3', to: '4' },
  ]);

  const addNode = (typeObj) => {
    const newNode = {
      id: `${Date.now()}`,
      type: typeObj.type,
      label: `${typeObj.label} ${nodes.length + 1}`,
      x: 40 + (nodes.length % 3) * 160 + (Math.random() * 40 - 20),
      y: 40 + Math.floor(nodes.length / 3) * 100 + (Math.random() * 40 - 20),
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setDraggedNode(nodeId);
  };

  const handleMouseMove = (e) => {
    if (draggedNode) {
      setNodes((prev) =>
        prev.map((n) => (n.id === draggedNode ? { ...n, x: n.x + e.movementX, y: n.y + e.movementY } : n))
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const handleNodeClick = (nodeId) => {
    if (selectedNode && selectedNode !== nodeId) {
      // Connect two nodes
      const exists = connections.some((c) => (c.from === selectedNode && c.to === nodeId) || (c.from === nodeId && c.to === selectedNode));
      if (!exists) {
        setConnections((prev) => [...prev, { from: selectedNode, to: nodeId }]);
      }
      setSelectedNode(null);
    } else {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
    }
  };

  const clearCanvas = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
  };

  return (
    <div className="card-3d rounded-2xl p-4 bg-[#0A0D1D] border border-blue-500/20 shadow-xl flex flex-col h-full min-h-[380px]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A233F]">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Layers size={16} />
          </span>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">System Architecture Canvas</h3>
            <p className="text-[10px] text-slate-400">Click node to select → Click 2nd node to draw connection arrow</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
            title="Clear canvas"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Node Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
        {NODE_TYPES.map((t) => {
          const IconComponent = t.icon;
          return (
            <button
              key={t.type}
              onClick={() => addNode(t)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-all hover:scale-105 ${t.color}`}
            >
              <IconComponent size={13} />
              <span>+ {t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas Area */}
      <div 
        className="relative flex-1 bg-[#060813] rounded-xl border border-[#162035] overflow-hidden min-h-[260px] p-2"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {connections.map((c, idx) => {
            const fromNode = nodes.find((n) => n.id === c.from);
            const toNode = nodes.find((n) => n.id === c.to);
            if (!fromNode || !toNode) return null;
            return (
              <g key={idx}>
                <line
                  x1={fromNode.x + 60}
                  y1={fromNode.y + 20}
                  x2={toNode.x + 60}
                  y2={toNode.y + 20}
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const nodeDef = NODE_TYPES.find((t) => t.type === node.type) || NODE_TYPES[0];
          const IconComp = nodeDef.icon;
          const isSelected = selectedNode === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onClick={() => handleNodeClick(node.id)}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              className={`absolute cursor-pointer p-2.5 rounded-xl border flex items-center gap-2 z-10 transition-all select-none ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-lg shadow-amber-500/20 scale-105 ring-2 ring-amber-400/50'
                  : nodeDef.color
              }`}
            >
              <IconComp size={16} />
              <span className="text-[11px] font-extrabold whitespace-nowrap">{node.label}</span>
            </div>
          );
        })}

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs font-semibold">
            Canvas Empty — Click components above to design your system architecture!
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemDesignCanvas;
