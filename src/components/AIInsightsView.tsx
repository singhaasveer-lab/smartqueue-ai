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
  const { insights, analytics, services, counters, fastAddDemoCustomer, callNext, addToast } = useQueue();

  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'assistant'; text: string; metric?: string; suggestion?: string; timestamp: number }[]
  >([
    {
      role: 'assistant',
      text: `Hello! I am **SmartQueue AI Engine**. I am monitoring ${analytics.totalWaiting} waiting attendees across ${counters.filter(c => c.status !== 'closed').length} counters. Ask me anything about queue bottlenecks, clearance forecasts, or staffing advice.`,
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
      { role: 'user' as const, text: q, timestamp: userMessageTime },
    ];
    setChatHistory(newHistory);
    setChatQuery('');

    // Simulated instant dynamic AI response
    setTimeout(() => {
      const response = answerAIQuestion(q, analytics, services, counters);
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
    addToast('Traffic Surge Simulated', '+3 new visitors joined the line.', 'warning');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Queue Intelligence & Insights
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic heuristic algorithms analyzing arrival velocity, counter throughput, and priority bottlenecks.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateSurge}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Add multiple test attendees to see AI recalculate"
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Simulate Traffic Surge (+3)</span>
          </button>
        </div>
      </div>

      {/* Congestion Gauge Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Real-Time Congestion Index
              </span>
              <span className="text-xs text-slate-400 font-mono">Updated just now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Current Queue Status:{' '}
              <span
                className={
                  analytics.congestionLevel === 'Severe'
                    ? 'text-rose-400'
                    : analytics.congestionLevel === 'High'
                    ? 'text-amber-400'
                    : analytics.congestionLevel === 'Moderate'
                    ? 'text-cyan-300'
                    : 'text-emerald-400'
                }
              >
                {analytics.congestionLevel} Congestion
              </span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {analytics.congestionLevel === 'Severe' || analytics.congestionLevel === 'High'
                ? `High visitor density detected. ${analytics.totalWaiting} attendees waiting exceeds ideal counter capacity. Recommend opening additional desks.`
                : analytics.congestionLevel === 'Moderate'
                ? `Steady line flow. Average wait time is ${analytics.avgWaitTimeMinutes} minutes. Staffing is currently balanced.`
                : `Optimal flow. Waiting line is moving rapidly with average response time under ${analytics.avgWaitTimeMinutes || 5} minutes.`}
            </p>
          </div>

          {/* Meter Graphic */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center min-w-[200px] text-center space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Backlog Clearance</p>
            <p className="text-4xl font-black font-mono text-cyan-400">
              ~{analytics.estimatedTimeToClearMinutes}m
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
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
                  width: `${Math.min(100, Math.max(15, (analytics.totalWaiting / 10) * 100))}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {analytics.totalWaiting} waiting / {counters.filter((c) => c.status !== 'closed').length} desks
            </p>
          </div>
        </div>
      </div>

      {/* Generated AI Insights Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Dynamic Operational Insights ({insights.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Calculated automatically from queue telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight) => {
            let borderStyle = 'border-slate-800 bg-slate-900/80';
            let iconColor = 'text-cyan-400';
            let Icon = Lightbulb;

            if (insight.type === 'alert') {
              borderStyle = 'border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-900';
              iconColor = 'text-rose-400';
              Icon = ShieldAlert;
            } else if (insight.type === 'warning') {
              borderStyle = 'border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-900';
              iconColor = 'text-amber-400';
              Icon = AlertTriangle;
            } else if (insight.type === 'success') {
              borderStyle = 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900';
              iconColor = 'text-emerald-400';
              Icon = CheckCircle2;
            } else if (insight.type === 'recommendation') {
              borderStyle = 'border-indigo-500/40 bg-gradient-to-b from-indigo-950/30 to-slate-900 ring-1 ring-indigo-500/20';
              iconColor = 'text-indigo-400';
              Icon = Sparkles;
            }

            return (
              <div
                key={insight.id}
                className={`p-5 rounded-2xl border shadow-lg flex flex-col justify-between space-y-4 ${borderStyle}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                      <span>{insight.type}</span>
                    </span>
                    {insight.metric && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-white border border-slate-800">
                        {insight.metric}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{insight.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{insight.message}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Confidence: {insight.confidence}%</span>
                  <span className="capitalize">Impact: {insight.impact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive AI Queue Consultant Assistant */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Ask SmartQueue AI Assistant</h2>
              <p className="text-xs text-slate-400">Natural language analysis & operational queries</p>
            </div>
          </div>
          <span className="text-xs text-cyan-400 font-mono">Live Telemetry Hooked</span>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="flex flex-wrap gap-2">
          {quickPromptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(chip)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-3 h-3 text-cyan-400" />
              <span>{chip}</span>
            </button>
          ))}
        </div>

        {/* Chat History Container */}
        <div className="space-y-3.5 max-h-[350px] overflow-y-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          {chatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  item.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                <p className="whitespace-pre-line">{item.text}</p>
                {item.metric && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-cyan-400 font-mono">
                    <span>Key Metric: {item.metric}</span>
                  </div>
                )}
                {item.suggestion && (
                  <div className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-[11px] text-indigo-300 font-medium">
                    💡 Suggestion: {item.suggestion}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about queue performance, staff allocation, or bottleneck fixes..."
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
