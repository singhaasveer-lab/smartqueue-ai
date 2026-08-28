import React from 'react';
import { useQueue } from '../context/QueueContext';
import { Sparkles, Terminal, Shield, HelpCircle, Radio, RotateCcw } from 'lucide-react';

interface FooterProps {
  onOpenInstructions: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInstructions }) => {
  const { setActiveTab, resetToDemoData, analytics } = useQueue();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <p className="font-bold text-white tracking-tight">SmartQueue AI</p>
              <p className="text-[10px] text-slate-500">Smarter queues. Less waiting.</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <button onClick={() => setActiveTab('landing')} className="hover:text-white transition-colors">
              Overview
            </button>
            <button onClick={() => setActiveTab('join')} className="hover:text-white transition-colors">
              Get Token
            </button>
            <button onClick={() => setActiveTab('live')} className="hover:text-white transition-colors">
              Live TV Board
            </button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors">
              Admin Desk
            </button>
            <button onClick={() => setActiveTab('insights')} className="hover:text-white transition-colors">
              AI Intelligence
            </button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-white transition-colors">
              Analytics
            </button>
            <button
              onClick={onOpenInstructions}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Run Locally</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>SmartQueue AI Engine Online &bull; LocalStorage Sync Active</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetToDemoData}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Benchmark Data</span>
            </button>
            <span>&copy; {new Date().getFullYear()} SmartQueue AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
