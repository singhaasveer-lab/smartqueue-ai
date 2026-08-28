import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { PriorityLevel, ServiceId, TokenStatus } from '../types';
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Search,
  Filter,
  Zap,
  Phone,
  FileText,
  UserCheck,
  UserX,
  Volume2,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  ChevronDown,
  Layers,
  Building2,
  Trash2,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

export const AdminDashboard: React.FC = () => {
  const {
    tokens,
    counters,
    services,
    analytics,
    callNext,
    startServing,
    completeCurrent,
    skipToken,
    recallToken,
    prioritizeToken,
    toggleCounterStatus,
    addCounter,
    resetToDemoData,
    clearAllData,
    fastAddDemoCustomer,
    joinQueue,
    addToast,
  } = useQueue();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'waiting' | 'serving' | 'priority' | 'completed' | 'skipped'>('waiting');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedCounterId, setSelectedCounterId] = useState<number>(1);

  // Walk-in modal
  const [showAddWalkin, setShowAddWalkin] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinService, setWalkinService] = useState<ServiceId>('general_enquiry');
  const [walkinPriority, setWalkinPriority] = useState<PriorityLevel>('normal');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinNotes, setWalkinNotes] = useState('');

  // Add counter modal
  const [showAddCounterModal, setShowAddCounterModal] = useState(false);
  const [newCounterName, setNewCounterName] = useState('');
  const [newStaffName, setNewStaffName] = useState('');

  // Active serving tokens
  const servingTokens = tokens.filter((t) => t.status === 'serving' || t.status === 'called');
  const waitingTokens = tokens.filter((t) => t.status === 'waiting');

  // Filtered Queue List
  const filteredTokens = tokens.filter((token) => {
    // Tab filter
    if (selectedTab === 'waiting' && token.status !== 'waiting') return false;
    if (selectedTab === 'serving' && token.status !== 'serving' && token.status !== 'called') return false;
    if (selectedTab === 'priority' && token.priority !== 'priority') return false;
    if (selectedTab === 'completed' && token.status !== 'completed') return false;
    if (selectedTab === 'skipped' && token.status !== 'skipped') return false;

    // Service filter
    if (selectedService !== 'all' && token.serviceId !== selectedService) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = token.customerName.toLowerCase().includes(q);
      const matchToken = token.tokenNumber.toLowerCase().includes(q);
      const matchPhone = token.customerPhone?.toLowerCase().includes(q);
      if (!matchName && !matchToken && !matchPhone) return false;
    }

    return true;
  }).sort((a, b) => {
    if (selectedTab === 'waiting' || selectedTab === 'all') {
      if (a.status === 'waiting' && b.status === 'waiting') {
        if (a.priority === 'priority' && b.priority !== 'priority') return -1;
        if (a.priority !== 'priority' && b.priority === 'priority') return 1;
        return a.joinedAt - b.joinedAt;
      }
    }
    return (b.calledAt || b.joinedAt) - (a.calledAt || a.joinedAt);
  });

  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) {
      addToast('Name Required', 'Please enter customer name.', 'warning');
      return;
    }

    joinQueue({
      name: walkinName.trim(),
      serviceId: walkinService,
      priority: walkinPriority,
      phone: walkinPhone.trim() || undefined,
      notes: walkinNotes.trim() || undefined,
    });

    setWalkinName('');
    setWalkinPhone('');
    setWalkinNotes('');
    setShowAddWalkin(false);
    addToast('Walk-in Registered', 'Added to queue list.', 'success');
  };

  const handleCreateCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounterName.trim()) return;
    addCounter(newCounterName, newStaffName || 'Staff Member');
    setNewCounterName('');
    setNewStaffName('');
    setShowAddCounterModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Admin & Staff Dispatch Desk
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
              Control Center
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage live multi-counter queues, dispatch next attendees, and trigger token notifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-add-walkin-btn"
            onClick={() => setShowAddWalkin(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Walk-in</span>
          </button>

          <button
            id="admin-fast-demo-btn"
            onClick={() => fastAddDemoCustomer(false)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Inject simulated customer into queue"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>+ Sim Visitor</span>
          </button>

          <button
            id="admin-fast-prio-btn"
            onClick={() => fastAddDemoCustomer(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Inject priority visitor"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>+ Sim VIP</span>
          </button>

          <button
            onClick={resetToDemoData}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-amber-300 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
            title="Reset to Demo State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Waiting</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black font-mono text-white">{analytics.totalWaiting}</p>
          <p className="text-[11px] text-slate-400">
            <strong className="text-amber-400">{analytics.priorityCount}</strong> priority ticket{analytics.priorityCount === 1 ? '' : 's'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Currently Serving</span>
            <Play className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black font-mono text-emerald-400">{analytics.totalServing}</p>
          <p className="text-[11px] text-slate-400">
            Across {counters.filter((c) => c.status !== 'closed').length} active desk stations
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Avg Waiting Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black font-mono text-cyan-400">{analytics.avgWaitTimeMinutes}m</p>
          <p className="text-[11px] text-slate-400">
            Estimated clear: ~{analytics.estimatedTimeToClearMinutes} mins
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Served Today</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black font-mono text-purple-300">{analytics.totalServedToday}</p>
          <p className="text-[11px] text-slate-400">
            {analytics.totalSkipped} skipped / no-show
          </p>
        </div>
      </div>

      {/* Counter Operator Stations & Quick Call Deck */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Counter Station Controllers</span>
            </h2>
            <p className="text-xs text-slate-400">Directly dispatch tokens to specific desk operators</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-call-next-global-btn"
              onClick={() => callNext(selectedCounterId)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Call Next to Selected Desk</span>
            </button>

            <button
              onClick={() => setShowAddCounterModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              + Add Desk
            </button>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {counters.map((counter) => {
            const servingToken = tokens.find((t) => t.id === counter.currentServingTokenId);
            const isSelected = selectedCounterId === counter.id;

            return (
              <div
                key={counter.id}
                onClick={() => setSelectedCounterId(counter.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                  counter.status === 'closed'
                    ? 'bg-slate-950/50 border-slate-800 opacity-60'
                    : isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-indigo-400 animate-ping' : 'bg-slate-500'}`} />
                    <span className="font-bold text-sm text-white">{counter.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCounterStatus(counter.id);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      counter.status === 'closed'
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                  >
                    {counter.status === 'closed' ? 'Closed (Click to Open)' : 'Open'}
                  </button>
                </div>

                {/* Serving Status */}
                {servingToken ? (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Current Token</span>
                        <p className="text-xl font-black font-mono text-white mt-0.5">{servingToken.tokenNumber}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase font-mono">
                        {servingToken.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      <p className="font-semibold text-white">{servingToken.customerName}</p>
                      <p className="text-[11px] text-slate-400">{servingToken.serviceName}</p>
                    </div>

                    {/* Quick Operator Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          completeCurrent(servingToken.id);
                        }}
                        className="py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          skipToken(servingToken.id);
                        }}
                        className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Skip (No Show)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-500 italic">No attendee assigned</p>
                    <button
                      disabled={counter.status === 'closed'}
                      onClick={(e) => {
                        e.stopPropagation();
                        callNext(counter.id);
                      }}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Call Next Token</span>
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-slate-400">Operator: {counter.staffName}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Queue Table & Filters */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        {/* Table Controls (Search, Tabs & Category Filter) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-thin">
            {[
              { id: 'waiting', label: 'Waiting Line', count: waitingTokens.length },
              { id: 'serving', label: 'In Service', count: servingTokens.length },
              { id: 'priority', label: 'Priority VIP', count: tokens.filter((t) => t.priority === 'priority').length },
              { id: 'all', label: 'All Records', count: tokens.length },
              { id: 'completed', label: 'Completed', count: tokens.filter((t) => t.status === 'completed').length },
              { id: 'skipped', label: 'Skipped', count: tokens.filter((t) => t.status === 'skipped').length },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${selectedTab === tab.id ? 'bg-indigo-900 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Service Filter */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search token / name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* The Queue Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Pos / Token</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Wait Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Desk Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 text-slate-300">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No matching queue entries found.
                  </td>
                </tr>
              ) : (
                filteredTokens.map((token, index) => {
                  const isServing = token.status === 'serving' || token.status === 'called';
                  const isWaiting = token.status === 'waiting';

                  return (
                    <tr
                      key={token.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        token.priority === 'priority' ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* Token Number */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 font-mono text-[10px] font-bold text-slate-400 flex items-center justify-center">
                            {isWaiting ? index + 1 : '—'}
                          </span>
                          <span className="font-mono font-black text-sm text-white">{token.tokenNumber}</span>
                        </div>
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-white">{token.customerName}</p>
                          {token.customerPhone && (
                            <p className="text-[10px] text-slate-400">{token.customerPhone}</p>
                          )}
                          {token.notes && (
                            <p className="text-[10px] text-indigo-300 italic truncate max-w-[140px]">
                              {token.notes}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Service Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-200">{token.serviceName}</span>
                      </td>

                      {/* Priority Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {token.priority === 'priority' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>VIP Priority</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Waiting Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono text-cyan-400 font-semibold">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {isServing
                              ? 'Now'
                              : isWaiting
                              ? `~${token.estimatedWaitMinutes}m`
                              : token.status === 'completed'
                              ? 'Served'
                              : '—'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            token.status === 'serving'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                              : token.status === 'called'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : token.status === 'waiting'
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : token.status === 'completed'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {token.status}
                          {token.assignedCounter ? ` (Desk ${token.assignedCounter})` : ''}
                        </span>
                      </td>

                      {/* Row Action Controls */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isWaiting && (
                            <>
                              <button
                                onClick={() => recallToken(token.id, selectedCounterId)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                                title="Call directly to selected counter"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>Call</span>
                              </button>

                              {token.priority !== 'priority' && (
                                <button
                                  onClick={() => prioritizeToken(token.id)}
                                  className="p-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 border border-slate-700 transition-all cursor-pointer"
                                  title="Upgrade to VIP Priority"
                                >
                                  <Zap className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => skipToken(token.id)}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all cursor-pointer"
                                title="Mark as Skipped (No Show)"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {isServing && (
                            <>
                              <button
                                onClick={() => completeCurrent(token.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Complete</span>
                              </button>
                              <button
                                onClick={() => skipToken(token.id)}
                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] transition-all cursor-pointer"
                              >
                                Skip
                              </button>
                            </>
                          )}

                          {token.status === 'skipped' && (
                            <button
                              onClick={() => recallToken(token.id, selectedCounterId)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                              title="Recall customer back into queue"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Recall</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Walk-in Modal */}
      {showAddWalkin && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleWalkinSubmit}
            className="max-w-lg w-full p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Manual Walk-In Registration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddWalkin(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Customer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rachel Adams"
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Service Category</label>
                <select
                  value={walkinService}
                  onChange={(e) => setWalkinService(e.target.value as ServiceId)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (~{s.avgDurationMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Priority Tier</label>
                <select
                  value={walkinPriority}
                  onChange={(e) => setWalkinPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="normal">Standard Walk-in</option>
                  <option value="priority">⭐ VIP Priority Pass</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={walkinPhone}
                onChange={(e) => setWalkinPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Staff Note / Reason</label>
              <input
                type="text"
                placeholder="e.g. Senior citizen fast-track"
                value={walkinNotes}
                onChange={(e) => setWalkinNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddWalkin(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
              >
                Generate Token & Place in Line
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Counter Modal */}
      {showAddCounterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCounter}
            className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New Service Counter</h3>
              <button
                type="button"
                onClick={() => setShowAddCounterModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Desk / Station Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Counter 4 - Specialist Desk"
                value={newCounterName}
                onChange={(e) => setNewCounterName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Assigned Staff Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Henderson"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddCounterModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg"
              >
                Add Station
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
