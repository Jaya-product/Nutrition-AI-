import React from 'react';
import { Database, FileText, Info } from 'lucide-react';

export const SourcesPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col w-[320px] h-full bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-2xl relative z-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <div className="p-2 bg-blue-600/10 rounded-lg text-blue-500 border border-blue-500/20">
          <Database size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-200 tracking-wide">Sources</h2>
          <p className="text-[11px] text-gray-500 mt-0.5">Knowledge Retrieval Engine</p>
        </div>
      </div>

      {/* Content - Empty for Milestone 1 */}
      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
          <FileText size={20} className="text-gray-400" />
        </div>
        <h3 className="text-[13px] font-medium text-gray-300 mb-2">No sources available yet.</h3>
        <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">
          Retrieval-Augmented Generation (RAG) is not active in Milestone 1. 
          Sources will be linked here in Milestone 2.
        </p>
      </div>

      {/* Footer Note */}
      <div className="mt-auto bg-blue-950/20 border border-blue-900/30 rounded-xl p-4 flex gap-3">
        <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-blue-300/80 leading-relaxed">
          The AI is currently relying entirely on its parametric memory. Claims shown in the chat have `source: null`.
        </p>
      </div>
    </div>
  );
};
