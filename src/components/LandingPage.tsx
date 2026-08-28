import React from 'react';
import { useQueue } from '../context/QueueContext';
import {
  Sparkles,
  Ticket,
  LayoutDashboard,
  Radio,
  BrainCircuit,
  Users,
  Clock,
  Zap,
  ShieldCheck,
  Building2,
  Stethoscope,
  GraduationCap,
  Landmark,
  Scissors,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  Layers,
  BellRing,
  Tv,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, analytics, tokens, counters, fastAddDemoCustomer, callNext } = useQueue();

  const waitingTokens = tokens.filter((t) => t.status === 'waiting');
  const servingTokens = tokens.filter((t) => t.status === 'serving' || t.status === 'called');

  const steps = [
    {
      step: '01',
      title: 'Digital Token Generation',
      description: 'Visitors scan a QR code or pick their required service at the kiosk, receiving an instant digital ticket on their phone.',
      icon: Ticket,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      step: '02',
      title: 'AI Wait-Time & Queue Tracking',
      description: 'SmartQueue AI calculates dynamic waiting estimates and alerts visitors as their turn approaches so they never wait in line.',
      icon: BrainCircuit,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      step: '03',
      title: 'Intelligent Multi-Desk Dispatch',
      description: 'Staff call the next attendee with a single click. High-visibility TV boards and audio chimes guide visitors to the exact counter.',
      icon: LayoutDashboard,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const industries = [
    {
      name: 'College & Universities',
      subtitle: 'Admissions, Fee Desks & Registrars',
      icon: GraduationCap,
      stat: '68% faster enrollment clearance',
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      name: 'Hospitals & Clinics',
      subtitle: 'Triage, Diagnostics & Pharmacies',
      icon: Stethoscope,
      stat: 'Reduced physical waiting room crowding',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'Banks & Financial Hubs',
      subtitle: 'Teller Desks, Loans & VIP Accounts',
      icon: Landmark,
      stat: 'Automated VIP priority routing',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      name: 'Government Citizen Desks',
      subtitle: 'Licensing, Passports & Civil Registry',
      icon: Building2,
      stat: 'Eliminated hallway bottleneck lines',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      name: 'Salons & Retail Centers',
      subtitle: 'Appointments & Express Checkouts',
      icon: Scissors,
      stat: 'Increased walk-in conversion by 42%',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950">
        {/* Glow ambient background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Smart Token & Queue Management</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-mono text-[11px]">System Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Smarter queues.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Less waiting.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Empower visitors to join lines digitally, receive real-time wait predictions, and track tokens from their smartphones. Give staff seamless multi-counter dispatching and predictive AI analytics.
            </p>

            {/* Main CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                id="hero-join-queue-btn"
                onClick={() => setActiveTab('join')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Join Queue as Customer</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                id="hero-admin-dash-btn"
                onClick={() => setActiveTab('admin')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 font-semibold text-sm transition-all shadow-md hover:border-slate-600 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Admin Staff Desk</span>
              </button>

              <button
                id="hero-live-tv-btn"
                onClick={() => setActiveTab('kiosk')}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 font-semibold text-sm transition-all hover:border-cyan-500/50 cursor-pointer"
              >
                <Tv className="w-4 h-4 text-cyan-400" />
                <span>TV Display Screen</span>
              </button>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-center">
                <p className="text-xl font-bold font-mono text-white">{analytics.totalWaiting}</p>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">In Line</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-center">
                <p className="text-xl font-bold font-mono text-cyan-400">{analytics.avgWaitTimeMinutes}m</p>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Avg Wait Time</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-center">
                <p className="text-xl font-bold font-mono text-emerald-400">{analytics.totalServedToday}</p>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Served Today</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-center">
                <p className="text-xl font-bold font-mono text-indigo-400">{counters.filter(c => c.status !== 'closed').length}</p>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Open Desks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Queue Status Snapshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">Live Station & Queue Status</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Real-time state synchronized with desk operators & kiosks</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fastAddDemoCustomer(false)}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span>+ Add Sample Visitor</span>
              </button>
              <button
                onClick={() => callNext()}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span>Call Next Token</span>
              </button>
              <button
                onClick={() => setActiveTab('live')}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1"
              >
                <span>View Full Screen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Counters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {counters.map((counter) => {
              const servingToken = tokens.find((t) => t.id === counter.currentServingTokenId);
              return (
                <div
                  key={counter.id}
                  className={`p-4 rounded-xl border transition-all ${
                    counter.status === 'closed'
                      ? 'bg-slate-900/50 border-slate-800 opacity-60'
                      : counter.currentServingTokenId
                      ? 'bg-indigo-950/30 border-indigo-500/40 ring-1 ring-indigo-500/20'
                      : 'bg-slate-900/80 border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{counter.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        counter.status === 'closed'
                          ? 'bg-slate-800 text-slate-400'
                          : counter.currentServingTokenId
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {counter.status === 'closed' ? 'Closed' : counter.currentServingTokenId ? 'Serving' : 'Ready'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Current Token</p>
                      <p className="text-2xl font-black font-mono tracking-tight text-white mt-0.5">
                        {servingToken ? servingToken.tokenNumber : '— None —'}
                      </p>
                    </div>
                    {servingToken && (
                      <div className="text-right">
                        <p className="text-xs font-semibold text-indigo-300">{servingToken.customerName}</p>
                        <p className="text-[11px] text-slate-400">{servingToken.serviceName}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Attendant: {counter.staffName}</span>
                    {servingToken?.priority === 'priority' && (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Priority
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Up Next Preview Strip */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Next in Queue ({waitingTokens.length} Waiting)</span>
              </span>
              <span className="text-xs text-slate-400">Est. Clear Time: ~{analytics.estimatedTimeToClearMinutes} mins</span>
            </div>

            {waitingTokens.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2 text-center">Queue is currently clear! Join to get token #1.</p>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {waitingTokens.slice(0, 6).map((token, index) => (
                  <div
                    key={token.id}
                    className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                      token.priority === 'priority'
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-300">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold font-mono text-white">{token.tokenNumber}</span>
                        {token.priority === 'priority' && (
                          <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded font-bold">VIP</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[90px]">{token.customerName}</p>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono pl-1">~{token.estimatedWaitMinutes}m</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Frictionless Flow
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">How SmartQueue AI Works</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Eliminate chaotic physical queues with a three-step intelligent digital pipeline designed for rapid turnaround.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${step.color} p-0.5 shadow-md`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-700">{step.step}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industry Solutions / Use Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Built For Every High-Traffic Venue
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
                Tailored for Real-World Workflows
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              From high-security financial counters to university fee halls and hospital triage centers, SmartQueue adapts to any service hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <div
                  key={ind.name}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3.5"
                >
                  <div className={`p-2.5 rounded-xl border ${ind.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">{ind.name}</h3>
                    <p className="text-[11px] text-slate-400">{ind.subtitle}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>{ind.stat}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">Dynamic AI Predictions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Considers historical desk velocity, priority loads, and active counter capacity to estimate exact wait times.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Priority / VIP Lane</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated fast-track queues for senior citizens, medical emergencies, faculty, and VIP clients.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <BellRing className="w-6 h-6 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Audio & Voice Synthesis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built-in audio synthesizer and Web Speech API announcement calls out tokens directly to public speakers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Zero Backend Required</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Persisted instantly with local storage and tab synchronization, ensuring 100% uptime with zero setup.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-blue-900/40 to-slate-900 border border-indigo-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to experience frictionless queue management?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Test the live customer token experience or jump right into the multi-desk staff controller.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('join')}
              className="px-6 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm shadow-xl transition-all cursor-pointer"
            >
              Get Your Digital Token
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-600 transition-all cursor-pointer"
            >
              Open Staff Admin Desk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
