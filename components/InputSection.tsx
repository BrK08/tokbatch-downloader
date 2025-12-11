import React, { useState } from 'react';
import { Plus, ClipboardPaste, AlertCircle } from 'lucide-react';

interface InputSectionProps {
  onAddLinks: (links: string[]) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAddLinks }) => {
  const [inputVal, setInputVal] = useState('');
  const [pasteError, setPasteError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!inputVal.trim()) return;
    
    // Split by new lines or spaces and filter empty strings
    const links = inputVal
      .split(/[\n\s]+/)
      .map(l => l.trim())
      .filter(l => l.length > 0 && l.includes('tiktok.com'));

    if (links.length > 0) {
      onAddLinks(links);
      setInputVal('');
      setPasteError(null);
    }
  };

  const handlePaste = async () => {
    try {
      setPasteError(null);
      const text = await navigator.clipboard.readText();
      setInputVal(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setPasteError("Clipboard blocked. Please paste manually (Ctrl+V).");
      setTimeout(() => setPasteError(null), 3000);
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-cyan-400" />
          Add Links
        </h2>
        <div className="flex items-center gap-2">
          {pasteError && (
            <span className="text-xs text-red-400 flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              {pasteError}
            </span>
          )}
          <button 
            onClick={handlePaste}
            className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <ClipboardPaste className="w-3 h-3" />
            Paste from clipboard
          </button>
        </div>
      </div>
      
      <textarea
        className="w-full h-32 bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none font-mono placeholder-slate-600 transition-all"
        placeholder={`Paste TikTok links here (one per line)...\nExample:\nhttps://www.tiktok.com/@user/video/123456\nhttps://vm.tiktok.com/AbCdEf/`}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleAdd}
          disabled={!inputVal.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-5 h-5" />
          Add to Queue
        </button>
      </div>
    </div>
  );
};