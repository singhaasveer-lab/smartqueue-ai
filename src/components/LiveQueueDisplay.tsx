import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import {
  Radio,
  Tv,
  Users,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  RotateCcw,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface LiveQueueDisplayProps {
  isKioskMode?: boolean;
}

export const LiveQueueDisplay: React.FC<LiveQueueDisplayProps> = ({ isKioskMode = false }) => {
  const {
    tokens,
    counters,
    analytics,
    soundEnabled,
    setSoundEnabled,
    speechEnabled,
    setSpeechEnabled,
    setActiveTab,
  } = useQueue();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Real-time clock for public TV display
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const waitingTokens = tokens
    .filter((t) => t.status === 'waiting')
    .sort((a, b) => {
      if (a.priority === 'priority' && b.priority !== 'priority') return -1;
      if (a.priority !== 'priority' && b.priority === 'priority') return 1;
      return a.joinedAt - b.joinedAt;
    });

  const servingTokens = tokens.filter((t) => t.status === 'serving' || t.status === 'called');
  const completedTokens = tokens
    .filter((t) => t.status === 'completed')
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
    .slice(0, 6);

  const nextToken = waitingTokens[0] || null;

  return (
    <div
      className={`min-h-[85vh] flex flex-col justify-between space-y-6 ${
        isKioskMode
          ? 'p-4 sm:p-8 bg-slate-950 text-white min-h-screen fixed inset-0 z-50 overflow-y-auto'
          : 'max-w-7xl mx-auto px-4 py-8'
      }`}
    >
      {/* Top Banner / Public Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Public Live Queue Display
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase animate-pulse">
                Live Broadcast
              </span>
            </div>
            <p className="text-xs text-slate-400">Tokens called will chime and flash with counter allocation.</p>
          </div>
        </div>

        {/* Real-time Clock & Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block px-4 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <p className="text-lg font-mono font-bold text-cyan-300">{currentTime || '12:00:00 PM'}</p>
            <p className="text-[10px] text-slate-400 font-medium">{currentDate || 'Today'}</p>
          </div>

          <button
            onClick={() => {
              soundManager.playChime('call');
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Test Chime Sound"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Test Chime</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="Toggle Fullscreen TV Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isKioskMode && (
            <button
              onClick={() => setActiveTab('landing')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
            >
              Exit TV Mode
            </button>
          )}
        </div>
      </div>

      {/* Main Board: Currently Serving Counters Display (High Visibility!) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-white">
              Now Serving at Counters
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {servingTokens.length} active service {servingTokens.length === 1 ? 'station' : 'stations'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {counters.map((counter) => {
            const servingToken = tokens.find((t) => t.id === counter.currentServingTokenId);
            const isAssigned = !!servingToken;

            return (
              <div
                key={counter.id}
                className={`relative rounded-3xl p-6 sm:p-7 border transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xl ${
                  counter.status === 'closed'
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-50'
                    : isAssigned
                    ? 'bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 border-indigo-500/60 ring-2 ring-indigo-500/30'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                {/* Background ambient glow if actively serving */}
                {isAssigned && (
                  <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-sm font-bold text-white tracking-wide">{counter.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        counter.status === 'closed'
                          ? 'bg-slate-800 text-slate-400'
                          : isAssigned
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {counter.status === 'closed' ? 'Closed' : isAssigned ? 'Active Call' : 'Available'}
                    </span>
                  </div>

                  {/* Gigantic Token Display */}
                  <div className="py-6 text-center">
                    <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                      Serving Token
                    </p>
                    {isAssigned && servingToken ? (
                      <div className="space-y-1 animate-in zoom-in-95 duration-300">
                        <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                          {servingToken.tokenNumber}
                        </span>
                        <p className="text-sm font-bold text-indigo-300 truncate px-2">
                          {servingToken.customerName}
                        </p>
                        <p className="text-xs text-slate-400">{servingToken.serviceName}</p>
                      </div>
                    ) : (
                      <div className="py-3">
                        <span className="text-3xl font-bold font-mono text-slate-600">— READY —</span>
                        <p className="text-xs text-slate-500 mt-1">Waiting for next attendee</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Desk Attendant: {counter.staffName}</span>
                  {servingToken?.priority === 'priority' && (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> VIP Priority
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Queue Sections (Next Up + Realtime Stats + Recent Completed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next in Queue List (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Upcoming in Line</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {waitingTokens.length} Waiting
            </span>
          </div>

          {waitingTokens.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
              <p>No customers currently waiting in line.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {waitingTokens.slice(0, 5).map((token, index) => (
                <div
                  key={token.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    index === 0
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-100'
                      : token.priority === 'priority'
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                        index === 0 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold font-mono text-sm text-white">{token.tokenNumber}</span>
                        {index === 0 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 font-bold uppercase">
                            Next
                          </span>
                        )}
                        {token.priority === 'priority' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{token.serviceName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400">~{token.estimatedWaitMinutes}m</span>
                    <p className="text-[10px] text-slate-500">Est. Wait</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Metrics & Recently Completed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <Users className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <p className="text-2xl font-black font-mono text-white">{analytics.totalWaiting}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Waiting</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-2xl font-black font-mono text-cyan-400">{analytics.avgWaitTimeMinutes}m</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Avg Wait Time</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <Sparkles className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-2xl font-black font-mono text-emerald-400">{analytics.avgServiceTimeMinutes}m</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Avg Service Time</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <CheckCircle2 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-2xl font-black font-mono text-purple-300">{analytics.totalServedToday}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Served Today</p>
            </div>
          </div>

          {/* Recently Completed Tokens Row */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recently Served Tokens</span>
              </span>
              <span className="text-[11px] text-slate-400">Fast Turnaround</span>
            </div>

            {completedTokens.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2 text-center">No completed tokens recorded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {completedTokens.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-200">{t.tokenNumber}</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[80px]">{t.customerName}</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10">
                      Done
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Running Marquee Ticker */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 overflow-hidden text-xs">
        <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider shrink-0">
          ANNOUNCEMENT
        </span>
        <div className="flex-1 truncate text-slate-300">
          <span>
            🔔 Please have your documents and token numbers ready before approaching the designated counter. Priority tickets are fast-tracked automatically.
          </span>
        </div>
      </div>
    </div>
  );
};
