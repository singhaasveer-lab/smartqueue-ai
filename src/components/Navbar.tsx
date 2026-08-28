import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import {
  Sparkles,
  Users,
  Tv,
  LayoutDashboard,
  BrainCircuit,
  BarChart3,
  Volume2,
  VolumeX,
  RotateCcw,
  Ticket,
  Menu,
  X,
  HelpCircle,
  Clock,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

interface NavbarProps {
  onOpenInstructions: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInstructions }) => {
  const {
    activeTab,
    setActiveTab,
    myActiveToken,
    soundEnabled,
    setSoundEnabled,
    speechEnabled,
    setSpeechEnabled,
    resetToDemoData,
    analytics,
  } = useQueue();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Sparkles },
    { id: 'join', label: 'Join Queue', icon: Ticket },
    { id: 'live', label: 'Live Queue', icon: Radio },
    { id: 'admin', label: 'Admin Desk', icon: LayoutDashboard },
    { id: 'insights', label: 'AI Insights', icon: BrainCircuit, badge: analytics.congestionLevel },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    SmartQueue
                  </span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 tracking-wide">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">Smarter queues. Less waiting.</p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        item.badge === 'High' || item.badge === 'Severe'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Active User Token Badge (if user has token) */}
            {myActiveToken && myActiveToken.status !== 'cancelled' && (
              <button
                id="my-active-ticket-btn"
                onClick={() => setActiveTab('join')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>My Token: <strong className="text-white font-mono">{myActiveToken.tokenNumber}</strong></span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 uppercase font-mono font-bold">
                  {myActiveToken.status === 'serving' ? 'At Desk' : myActiveToken.status === 'called' ? 'Called!' : `~${myActiveToken.estimatedWaitMinutes}m`}
                </span>
              </button>
            )}

            {/* Waiting Hall / TV Kiosk Mode */}
            <button
              id="kiosk-mode-btn"
              onClick={() => setActiveTab('kiosk')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeTab === 'kiosk'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80'
              }`}
              title="Full Screen TV / Waiting Room Public Display"
            >
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span>TV Board</span>
            </button>

            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-400'
              }`}
              title={soundEnabled ? 'Chime & Audio Enabled' : 'Audio Muted'}
              aria-label="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Local Run Guide / Setup Info */}
            <button
              id="run-guide-btn"
              onClick={onOpenInstructions}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all"
              title="Local Run & Architecture Guide"
              aria-label="Help & Run Guide"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Demo Reset */}
            <button
              id="reset-demo-btn"
              onClick={resetToDemoData}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all"
              title="Reset to Realistic Demo Data"
              aria-label="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {myActiveToken && myActiveToken.status !== 'cancelled' && (
            <div
              onClick={() => {
                setActiveTab('join');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-emerald-300">My Active Ticket</span>
              </div>
              <span className="font-mono text-sm font-bold text-white bg-emerald-950 px-2 py-0.5 rounded">
                {myActiveToken.tokenNumber}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                setActiveTab('kiosk');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'kiosk'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800/60 text-cyan-400 hover:bg-slate-800'
              }`}
            >
              <Tv className="w-4 h-4 shrink-0" />
              <span>TV Waiting Board</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white"
            >
              <span>Voice Announcements:</span>
              <strong className={speechEnabled ? 'text-emerald-400' : 'text-slate-500'}>
                {speechEnabled ? 'ON' : 'OFF'}
              </strong>
            </button>
            <button
              onClick={() => {
                resetToDemoData();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-amber-400 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
