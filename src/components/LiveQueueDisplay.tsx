import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import {
  Radio,
  Tv,
  Users,
  Clock,
  CheckCircle2,
  Volume2,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface LiveQueueDisplayProps {
  isKioskMode?: boolean;
}

export const LiveQueueDisplay: React.FC<LiveQueueDisplayProps> = ({
  isKioskMode = false,
}) => {
  const {
    tokens,
    counters,
    analytics,
    setActiveTab,
  } = useQueue();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();

      setCurrentTime(
        d.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );

      setCurrentDate(
        d.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Keep fullscreen state synchronized with browser fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const waitingTokens = tokens
    .filter((t) => t.status === 'waiting')
    .sort((a, b) => {
      if (a.priority === 'priority' && b.priority !== 'priority') return -1;
      if (a.priority !== 'priority' && b.priority === 'priority') return 1;

      return a.joinedAt - b.joinedAt;
    });

  const servingTokens = tokens.filter(
    (t) => t.status === 'serving' || t.status === 'called'
  );

  const completedTokens = tokens
    .filter((t) => t.status === 'completed')
    .sort(
      (a, b) => (b.completedAt || 0) - (a.completedAt || 0)
    )
    .slice(0, 6);

  return (
    <div
      className={`w-full min-w-0 overflow-x-hidden ${
        isKioskMode
          ? 'fixed inset-0 z-50 min-h-screen overflow-y-auto bg-slate-950 text-white p-4 sm:p-6 lg:p-8'
          : 'min-h-[85vh] bg-transparent px-3 py-5 sm:px-5 sm:py-7 lg:px-6 lg:py-8'
      }`}
    >
      <div
        className={`mx-auto w-full min-w-0 ${
          isKioskMode ? 'max-w-none' : 'max-w-7xl'
        }`}
      >
        {/* =========================================================
            HEADER
        ========================================================== */}
        <div className="w-full min-w-0 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-indigo-950 p-4 shadow-xl sm:p-5 lg:p-6">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Brand */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20 sm:h-12 sm:w-12">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                  <Radio className="h-5 w-5 animate-pulse text-cyan-400 sm:h-6 sm:w-6" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h1 className="truncate text-lg font-black tracking-tight text-white sm:text-xl lg:text-2xl">
                    Public Live Queue Display
                  </h1>

                  <span className="shrink-0 rounded border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-400 sm:text-xs">
                    Live Broadcast
                  </span>
                </div>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-400 sm:text-xs">
                  Tokens called will chime and flash with counter allocation.
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <div className="hidden rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-1.5 text-right sm:block">
                <p className="whitespace-nowrap font-mono text-base font-bold text-cyan-300 sm:text-lg">
                  {currentTime || '12:00:00 PM'}
                </p>

                <p className="whitespace-nowrap text-[10px] font-medium text-slate-400">
                  {currentDate || 'Today'}
                </p>
              </div>

              <button
                onClick={() => soundManager.playChime('call')}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700"
                title="Test Chime Sound"
              >
                <Volume2 className="h-4 w-4 text-cyan-400" />

                <span className="hidden md:inline">
                  Test Chime
                </span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="shrink-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-200 transition-all hover:bg-slate-700"
                title="Toggle Fullscreen TV Mode"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>

              {isKioskMode && (
                <button
                  onClick={() => setActiveTab('landing')}
                  className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-indigo-500"
                >
                  Exit TV Mode
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            NOW SERVING
        ========================================================== */}
        <section className="mt-6 min-w-0 space-y-4">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 animate-ping rounded-full bg-emerald-400" />

              <h2 className="text-base font-extrabold uppercase tracking-wider text-white sm:text-lg lg:text-xl">
                Now Serving at Counters
              </h2>
            </div>

            <span className="shrink-0 text-xs text-slate-400">
              {servingTokens.length} active service{' '}
              {servingTokens.length === 1 ? 'station' : 'stations'}
            </span>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {counters.map((counter) => {
              const servingToken = tokens.find(
                (t) => t.id === counter.currentServingTokenId
              );

              const isAssigned = !!servingToken;

              return (
                <div
                  key={counter.id}
                  className={`relative min-w-0 overflow-hidden rounded-3xl border p-5 shadow-2xl transition-all duration-500 sm:p-6 ${
                    counter.status === 'closed'
                      ? 'border-slate-800/60 bg-slate-900/40 opacity-50'
                      : isAssigned
                      ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 ring-1 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-900/90'
                  }`}
                >
                  {isAssigned && (
                    <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-cyan-500/10 blur-2xl" />
                  )}

                  <div className="relative min-w-0">
                    {/* Counter header */}
                    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <span className="min-w-0 truncate text-sm font-bold tracking-wide text-white">
                        {counter.name}
                      </span>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          counter.status === 'closed'
                            ? 'bg-slate-800 text-slate-400'
                            : isAssigned
                            ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                            : 'border border-blue-500/40 bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {counter.status === 'closed'
                          ? 'Closed'
                          : isAssigned
                          ? 'Active Call'
                          : 'Available'}
                      </span>
                    </div>

                    {/* Token */}
                    <div className="py-6 text-center">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Serving Token
                      </p>

                      {isAssigned && servingToken ? (
                        <div className="min-w-0 animate-in space-y-1 zoom-in-95 duration-300">
                          <span className="block truncate bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text font-mono text-4xl font-black tracking-tight text-transparent sm:text-5xl">
                            {servingToken.tokenNumber}
                          </span>

                          <p className="truncate px-2 text-sm font-bold text-indigo-300">
                            {servingToken.customerName}
                          </p>

                          <p className="truncate px-2 text-xs text-slate-400">
                            {servingToken.serviceName}
                          </p>
                        </div>
                      ) : (
                        <div className="py-3">
                          <span className="block truncate text-2xl font-bold text-slate-600 sm:text-3xl">
                            — READY —
                          </span>

                          <p className="mt-1 text-xs text-slate-500">
                            Waiting for next attendee
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative flex min-w-0 items-center justify-between gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400">
                    <span className="min-w-0 truncate">
                      Desk Attendant: {counter.staffName}
                    </span>

                    {servingToken?.priority === 'priority' && (
                      <span className="flex shrink-0 items-center gap-1 font-bold text-amber-400">
                        <Zap className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          VIP Priority
                        </span>
                        <span className="sm:hidden">VIP</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            QUEUE + METRICS
        ========================================================== */}
        <section className="mt-6 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Upcoming Queue */}
          <div className="min-w-0 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl sm:p-6 lg:col-span-5">
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex min-w-0 items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-cyan-400" />

                <h3 className="truncate text-sm font-bold uppercase tracking-wider text-white">
                  Upcoming in Line
                </h3>
              </div>

              <span className="shrink-0 font-mono text-xs font-bold text-slate-400">
                {waitingTokens.length} Waiting
              </span>
            </div>

            {waitingTokens.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500/40" />

                <p>No customers currently waiting in line.</p>
              </div>
            ) : (
              <div className="max-h-[300px] space-y-2.5 overflow-y-auto overflow-x-hidden pr-1">
                {waitingTokens.slice(0, 5).map((token, index) => (
                  <div
                    key={token.id}
                    className={`flex min-w-0 items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
                      index === 0
                        ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-100'
                        : token.priority === 'priority'
                        ? 'border-amber-500/30 bg-amber-950/20 text-amber-100'
                        : 'border-slate-800 bg-slate-950/60 text-slate-200'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                          index === 0
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        #{index + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate font-mono text-sm font-bold text-white">
                            {token.tokenNumber}
                          </span>

                          {index === 0 && (
                            <span className="shrink-0 rounded bg-cyan-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-950">
                              Next
                            </span>
                          )}

                          {token.priority === 'priority' && (
                            <span className="shrink-0 rounded border border-amber-500/30 bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-300">
                              VIP
                            </span>
                          )}
                        </div>

                        <p className="truncate text-[11px] text-slate-400">
                          {token.serviceName}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        ~{token.estimatedWaitMinutes}m
                      </span>

                      <p className="text-[10px] text-slate-500">
                        Est. Wait
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="min-w-0 space-y-4 lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center">
                <Users className="mx-auto mb-1 h-4 w-4 text-indigo-400" />

                <p className="truncate font-mono text-2xl font-black text-white">
                  {analytics.totalWaiting}
                </p>

                <p className="truncate text-[9px] font-bold uppercase text-slate-400">
                  Total Waiting
                </p>
              </div>

              <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center">
                <Clock className="mx-auto mb-1 h-4 w-4 text-cyan-400" />

                <p className="truncate font-mono text-2xl font-black text-cyan-400">
                  {analytics.avgWaitTimeMinutes}m
                </p>

                <p className="truncate text-[9px] font-bold uppercase text-slate-400">
                  Avg Wait Time
                </p>
              </div>

              <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center">
                <Sparkles className="mx-auto mb-1 h-4 w-4 text-emerald-400" />

                <p className="truncate font-mono text-2xl font-black text-emerald-400">
                  {analytics.avgServiceTimeMinutes}m
                </p>

                <p className="truncate text-[9px] font-bold uppercase text-slate-400">
                  Avg Service Time
                </p>
              </div>

              <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-center">
                <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-purple-400" />

                <p className="truncate font-mono text-2xl font-black text-purple-300">
                  {analytics.totalServedToday}
                </p>

                <p className="truncate text-[9px] font-bold uppercase text-slate-400">
                  Served Today
                </p>
              </div>
            </div>

            {/* Recently Served */}
            <div className="min-w-0 rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
              <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-800 pb-3 text-xs">
                <span className="flex min-w-0 items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />

                  <span className="truncate">
                    Recently Served Tokens
                  </span>
                </span>

                <span className="shrink-0 text-[10px] text-slate-400 sm:text-[11px]">
                  Fast Turnaround
                </span>
              </div>

              {completedTokens.length === 0 ? (
                <p className="py-3 text-center text-xs italic text-slate-500">
                  No completed tokens recorded yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {completedTokens.map((t) => (
                    <div
                      key={t.id}
                      className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5"
                    >
                      <div className="min-w-0">
                        <span className="block truncate font-mono text-xs font-bold text-slate-200">
                          {t.tokenNumber}
                        </span>

                        <p className="truncate text-[10px] text-slate-400">
                          {t.customerName}
                        </p>
                      </div>

                      <span className="shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                        Done
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            ANNOUNCEMENT
        ========================================================== */}
        <div className="mt-6 flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs">
          <span className="shrink-0 rounded-lg bg-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Announcement
          </span>

          <div className="min-w-0 flex-1 truncate text-slate-300">
            🔔 Please have your documents and token numbers ready before
            approaching the designated counter. Priority tickets are
            fast-tracked automatically.
          </div>
        </div>
      </div>
    </div>
  );
};