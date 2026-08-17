import React from 'react';
import { ChevronDown, RotateCcw, Sparkles, Wand2 } from 'lucide-react';

const EditorToolbar = React.memo(({
  selectedLanguage,
  onLanguageChange,
  availableLanguages,
  languageLabels,
  onResetCode,
  onFormatCode,
  onRunCoPilot,
  coPilotReviewing
}) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A253F] bg-[#0C1222] rounded-t-xl" data-testid="editor-toolbar">
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none bg-[#080D1A] border border-[#162035] rounded-full pl-3 pr-7 py-1 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            aria-label="Select Programming Language"
            data-testid="language-select"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang} style={{ backgroundColor: '#080D1A', color: '#E2E8F0' }}>
                {languageLabels[lang] || lang}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <button
          type="button"
          onClick={onResetCode}
          className="px-2.5 py-1 rounded-full bg-[#090710] border border-[#2B2144] hover:border-amber-500/40 text-[11px] font-semibold text-slate-300 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer"
          title="Reset starter template code"
          aria-label="Reset Code Template"
        >
          <RotateCcw size={12} className="text-amber-400" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          type="button"
          onClick={onFormatCode}
          className="px-2.5 py-1 rounded-full bg-[#090710] border border-[#2B2144] hover:border-purple-500/40 text-[11px] font-semibold text-slate-300 hover:text-purple-400 transition-all flex items-center gap-1 cursor-pointer"
          title="Auto-format code indentation"
          aria-label="Format Code"
        >
          <Sparkles size={12} className="text-purple-400" />
          <span className="hidden sm:inline">Format</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRunCoPilot}
          disabled={coPilotReviewing}
          className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-[11px] font-bold text-white shadow-md flex items-center gap-1.5 cursor-pointer border border-rose-400/30 disabled:opacity-50"
          aria-label="AI Co-Pilot Review"
        >
          <Wand2 size={13} className="text-amber-200 animate-pulse" />
          <span>{coPilotReviewing ? 'Analyzing...' : 'AI Review'}</span>
        </button>
      </div>
    </div>
  );
});

export default EditorToolbar;
