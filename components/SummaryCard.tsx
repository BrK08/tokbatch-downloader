import React from 'react';
import { BatchSummary } from '../types';
import { Sparkles, FolderOpen } from 'lucide-react';

interface SummaryCardProps {
  summary: BatchSummary;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <div className="bg-gradient-to-r from-purple-900/40 to-slate-900/40 border border-purple-500/30 rounded-xl p-6 mb-8 backdrop-blur-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-300">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            AI Batch Analysis
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20">
              Gemini 2.5 Flash
            </span>
          </h3>
          <p className="text-slate-300 text-sm mb-3">
            {summary.description}
          </p>
          <div className="flex items-center gap-3 text-sm font-mono text-cyan-400 bg-black/30 px-3 py-2 rounded-lg inline-block border border-slate-700">
            <FolderOpen className="w-4 h-4" />
            <span>Suggested Folder: /{summary.folderName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};