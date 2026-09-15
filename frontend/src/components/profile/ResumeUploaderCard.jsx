import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export const ResumeUploaderCard = () => {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setParsing(true);
      setTimeout(() => {
        setParsing(false);
        setParsed(true);
      }, 700);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileText size={18} className="text-rose-600" />
          <span>Resume & Portfolio Parser</span>
        </h3>
        <p className="text-xs text-slate-600 mt-0.5">
          Upload your latest PDF resume to automatically tailor questions and mock interview loops.
        </p>
      </div>

      {!file ? (
        <label className="border-2 border-dashed border-slate-200 hover:border-rose-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-rose-50/20 transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-500">
            <Upload size={20} />
          </div>
          <span className="text-xs font-bold text-slate-700">
            Click to upload or drag and drop PDF resume
          </span>
          <span className="text-[10px] text-slate-400">PDF, DOCX up to 10MB</span>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block truncate max-w-xs">
                {file.name}
              </span>
              <span className="text-[10px] text-slate-500">
                {parsing ? 'Parsing background skills...' : 'Parsed & synchronized with AI model'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {parsed && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Ready</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setParsed(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploaderCard;
