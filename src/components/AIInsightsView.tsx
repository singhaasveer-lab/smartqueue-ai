import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Users,
  Building2,
  Zap,
  HelpCircle,
  Send,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { answerAIQuestion } from '../utils/aiEngine';

export const AIInsightsView: React.FC = () => {
  const {
    insights,
    analytics,
    services,
    counters,
    fastAddDemoCustomer,
    callNext,
    addToast,
  } = useQueue();

  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<
    {
      role: 'user' | 'assistant';
      text: string;
      metric?: string;
      suggestion?: string;
      timestamp: number;
    }[]
  >([
    {
      role: 'assistant',
      text: `Hello! I am **SmartQueue AI Engine**. I am monitoring ${analytics.totalWaiting} waiting attendees across ${counters.filter((c) => c.status !== 'closed').length} counters. Ask me anything about queue bottlenecks, clearance forecasts, or staffing advice.`,
      metric: `${analytics.congestionLevel} Congestion`,
      timestamp: Date.now(),
    },
  ]);

  const quickPromptChips = [
    'How long to clear the current queue?',
    'Which service desk is our bottleneck?',
    'Should we open another counter?',
    'How is priority traffic impacting wait times?',
  ];

  const handleSendQuery = (textToSend?: string) => {
    const q = (textToSend || chatQuery).trim();

    if (!q) return;

    const userMessageTime = Date.now();

    const newHistory = [
      ...chatHistory,
      {
        role: 'user' as const,
        text: q,
        timestamp: userMessageTime,
      },
    ];

    setChatHistory(newHistory);
    setChatQuery('');

    setTimeout(() => {
      const response = answerAIQuestion(
        q,
        analytics,
        services,
        counters
      );

      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.answer,
          metric: response.relatedMetric,
          suggestion: response.actionSuggestion,
          timestamp: Date.now(),
        },
      ]);
    }, 300);
  };

  const handleSimulateSurge = () => {
    for (let i = 0; i < 3; i++) {
      fastAddDemoCustomer(i === 0);
    }

    addToast(
      'Traffic Surge Simulated',
      '+3 new visitors joined the line.',
      'warning'
    );
  };

  const activeCounters = counters.filter(
    (counter) => counter.status !== 'closed'
  ).length;

  const clearancePercentage = Math.min(
    100,
    Math.max(
      15,
      (analytics.totalWaiting / 10) * 100
    )
  );

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl min-w-0 px-3 py-5 sm:px-5 sm:py-7 lg:px-6 lg:py-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
         <div className="bg-gradient-to-r from-[#163a5f] via-[#163a5f] to-[#315b87] dark:from-[#0d213a] dark:via-[#0d213a] dark:to-[#173b5d] px-5 py-6 text-white sm:px-7">
            <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="min-w-0">
                <div className="mb-2 flex min-w-0 items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                    <BrainCircuit className="h-5 w-5 text-blue-200" />
                  </div>

                  <div className="min-w-0">
                    <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
                      AI Queue Intelligence & Insights
                    </h1>
                  </div>
                </div>

                <p className="max-w-3xl text-xs leading-relaxed text-blue-100/80 sm:text-sm">
                  Dynamic heuristic algorithms analyzing arrival velocity,
                  counter throughput, and priority bottlenecks.
                </p>
              </div>

              <button
                onClick={handleSimulateSurge}
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-amber-300/20 bg-amber-400/10 px-3.5 py-2.5 text-xs font-bold text-amber-100 transition-all hover:bg-amber-400/20"
                title="Add multiple test attendees to see AI recalculate"
              >
                <TrendingUp className="h-4 w-4 text-amber-300" />
                <span>Simulate Traffic Surge (+3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            CONGESTION BANNER
        ====================================================== */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
          <div className="bg-gradient-to-br from-[var(--card-soft)] via-[var(--card)] to-[var(--primary-light)] p-5 sm:p-7">

            <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="min-w-0 max-w-3xl">
                <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300">
                    Real-Time Congestion Index
                  </span>

                  <span className="text-[10px] font-mono text-[var(--muted)]">
                    Updated just now
                  </span>
                </div>

                <h2 className="text-xl font-black text-[var(--foreground)] sm:text-2xl lg:text-3xl">
                  Current Queue Status:{' '}
                  <span
                    className={
                      analytics.congestionLevel === 'Severe'
                        ? 'text-rose-500'
                        : analytics.congestionLevel === 'High'
                        ? 'text-amber-500'
                        : analytics.congestionLevel === 'Moderate'
                        ? 'text-cyan-500'
                        : 'text-emerald-500'
                    }
                  >
                    {analytics.congestionLevel} Congestion
                  </span>
                </h2>

                <p className="mt-3 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
                  {analytics.congestionLevel === 'Severe' ||
                  analytics.congestionLevel === 'High'
                    ? `High visitor density detected. ${analytics.totalWaiting} attendees waiting exceeds ideal counter capacity. Recommend opening additional desks.`
                    : analytics.congestionLevel === 'Moderate'
                    ? `Steady line flow. Average wait time is ${analytics.avgWaitTimeMinutes} minutes. Staffing is currently balanced.`
                    : `Optimal flow. Waiting line is moving rapidly with average response time under ${analytics.avgWaitTimeMinutes || 5} minutes.`}
                </p>
              </div>

              {/* CLEARANCE METER */}
              <div className="w-full shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center shadow-md sm:p-6 lg:w-60">

                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  Backlog Clearance
                </p>

                <p className="mt-1 font-mono text-3xl font-black text-cyan-500 sm:text-4xl">
                  ~{analytics.estimatedTimeToClearMinutes}m
                </p>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--card-soft)]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      analytics.congestionLevel === 'Severe'
                        ? 'bg-rose-500'
                        : analytics.congestionLevel === 'High'
                        ? 'bg-amber-500'
                        : analytics.congestionLevel === 'Moderate'
                        ? 'bg-cyan-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${clearancePercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] font-mono text-[var(--muted)]">
                  {analytics.totalWaiting} waiting / {activeCounters} desks
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            AI INSIGHTS
        ====================================================== */}
        <section className="mb-6 space-y-4">

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex min-w-0 items-center gap-2 text-base font-bold text-[var(--foreground)]">
              <Sparkles className="h-4 w-4 shrink-0 text-indigo-500" />

              <span>
                Dynamic Operational Insights ({insights.length})
              </span>
            </h2>

            <span className="text-[10px] text-[var(--muted)] sm:text-xs">
              Calculated automatically from queue telemetry
            </span>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {insights.map((insight) => {
              let borderStyle =
                'border-[var(--border)] bg-[var(--card)]';

              let iconColor = 'text-cyan-500';
              let Icon = Lightbulb;

              if (insight.type === 'alert') {
                borderStyle =
                  'border-rose-500/30 bg-gradient-to-b from-rose-500/5 to-[var(--card)]';
                iconColor = 'text-rose-500';
                Icon = ShieldAlert;
              } else if (insight.type === 'warning') {
                borderStyle =
                  'border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-[var(--card)]';
                iconColor = 'text-amber-500';
                Icon = AlertTriangle;
              } else if (insight.type === 'success') {
                borderStyle =
                  'border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-[var(--card)]';
                iconColor = 'text-emerald-500';
                Icon = CheckCircle2;
              } else if (insight.type === 'recommendation') {
                borderStyle =
                  'border-indigo-500/30 bg-gradient-to-b from-indigo-500/5 to-[var(--card)]';
                iconColor = 'text-indigo-500';
                Icon = Sparkles;
              }

              return (
                <div
                  key={insight.id}
                  className={`min-w-0 overflow-hidden rounded-2xl border p-5 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${borderStyle}`}
                >
                  <div className="flex min-h-[170px] flex-col justify-between space-y-4">

                    <div className="space-y-2.5">
                      <div className="flex min-w-0 items-center justify-between gap-2">

                        <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                          <Icon
                            className={`h-3.5 w-3.5 shrink-0 ${iconColor}`}
                          />

                          <span className="truncate">
                            {insight.type}
                          </span>
                        </span>

                        {insight.metric && (
                          <span className="max-w-[45%] shrink-0 truncate rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-2 py-1 font-mono text-[9px] font-bold text-[var(--foreground)]">
                            {insight.metric}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold leading-snug text-[var(--foreground)]">
                        {insight.title}
                      </h3>

                      <p className="text-xs leading-relaxed text-[var(--muted)]">
                        {insight.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-[10px] text-[var(--muted)]">
                      <span>
                        Confidence: {insight.confidence}%
                      </span>

                      <span className="capitalize">
                        Impact: {insight.impact}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {insights.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-10 text-center">
                <Sparkles className="mx-auto mb-3 h-7 w-7 text-[var(--muted)]" />

                <p className="text-sm font-bold text-[var(--foreground)]">
                  No operational insights yet
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Add visitors to the queue and SmartQueue AI will
                  generate recommendations.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            AI ASSISTANT
        ====================================================== */}
        <section className="min-w-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl">

          <div className="p-5 sm:p-7">

            <div className="mb-5 flex min-w-0 flex-col gap-3 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10">
                  <BrainCircuit className="h-4 w-4 text-indigo-500" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-[var(--foreground)]">
                    Ask SmartQueue AI Assistant
                  </h2>

                  <p className="truncate text-[10px] text-[var(--muted)] sm:text-xs">
                    Natural language analysis & operational queries
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-[10px] font-mono text-cyan-500 sm:text-xs">
                Live Telemetry Hooked
              </span>
            </div>

            {/* QUICK PROMPTS */}
            <div className="mb-5 flex max-w-full gap-2 overflow-x-auto pb-1">
              {quickPromptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(chip)}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-all hover:border-indigo-400 hover:bg-indigo-500/10"
                >
                  <Lightbulb className="h-3 w-3 shrink-0 text-cyan-500" />
                  <span>{chip}</span>
                </button>
              ))}
            </div>

            {/* CHAT HISTORY */}
            <div className="mb-4 max-h-[350px] min-h-[220px] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] p-3 sm:p-4">

              <div className="space-y-3.5">
                {chatHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex min-w-0 flex-col ${
                      item.role === 'user'
                        ? 'items-end'
                        : 'items-start'
                    }`}
                  >
                    <div
                      className={`
                        max-w-[92%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm sm:max-w-xl
                        ${
                          item.role === 'user'
                            ? 'rounded-br-none bg-indigo-600 text-white'
                            : 'rounded-bl-none border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]'
                        }
                      `}
                    >
                      <p className="whitespace-pre-line break-words">
                        {item.text}
                      </p>

                      {item.metric && (
                        <div
                          className={`
                            mt-3 flex items-center justify-between border-t pt-2 font-mono text-[10px]
                            ${
                              item.role === 'user'
                                ? 'border-white/20 text-cyan-100'
                                : 'border-[var(--border)] text-cyan-500'
                            }
                          `}
                        >
                          <span>
                            Key Metric: {item.metric}
                          </span>
                        </div>
                      )}

                      {item.suggestion && (
                        <div
                          className={`
                            mt-2 rounded-lg border p-2 text-[11px] font-medium
                            ${
                              item.role === 'user'
                                ? 'border-white/20 bg-white/10 text-white'
                                : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
                            }
                          `}
                        >
                          💡 Suggestion: {item.suggestion}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INPUT */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex min-w-0 flex-col gap-2 sm:flex-row"
            >
              <div className="relative min-w-0 flex-1">
                <HelpCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />

                <input
                  type="text"
                  placeholder="Ask about queue performance, staff allocation, or bottleneck fixes..."
                  value={chatQuery}
                  onChange={(e) =>
                    setChatQuery(e.target.value)
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] py-3 pl-10 pr-4 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-indigo-500"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};