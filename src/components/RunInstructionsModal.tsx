import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Copy,
  Check,
  Terminal,
  Layers,
  Sparkles,
  Database,
  Cpu,
  Tv,
} from 'lucide-react';

interface RunInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunInstructionsModal: React.FC<RunInstructionsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippet = `# 1. Clone the repository
git clone <your-repo-url>
cd smartqueue-ai

# 2. Install required packages
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser:
# http://localhost:3000`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">How to Run SmartQueue AI Locally</h2>
              <p className="text-xs text-slate-400">Step-by-step local development & architecture overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NPM Instructions Block */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>NPM Shell Commands</span>
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
            {codeSnippet}
          </pre>
        </div>

        {/* Feature & Architecture Highlights */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Architecture & Storage Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Zero Backend Persistence</span>
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Uses localStorage with cross-tab synchronizer. Open the Admin Desk in one window and Customer Token in another to see instant live updates!
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dynamic AI Intelligence</span>
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Real-time queue load algorithm estimates clearance velocity, bottlenecks, and staffing recommendations dynamically.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-emerald-400" />
                <span>Waiting Room TV Kiosk</span>
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Click "TV Board" or Kiosk mode to launch a full-screen display board with Web Audio attention chimes and voice synthesis.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Priority Dispatch Engine</span>
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                VIP / Priority triage allows fast-track processing for seniors, emergencies, or faculty while maintaining fairness.
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
