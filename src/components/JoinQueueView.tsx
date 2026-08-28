import React, { useState, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { PriorityLevel, ServiceId } from '../types';
import {
  Ticket,
  User,
  Phone,
  FileText,
  Zap,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  QrCode,
  Share2,
  Printer,
  Trash2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck,
  CreditCard,
  Cpu,
  Calendar,
  Layers,
  ChevronRight,
  Radio,
  Volume2,
} from 'lucide-react';
import { soundManager } from '../utils/sound';

export const JoinQueueView: React.FC = () => {
  const {
    services,
    joinQueue,
    leaveQueue,
    myActiveToken,
    tokens,
    counters,
    setActiveTab,
    addToast,
  } = useQueue();

  // Form State
  const [name, setName] = useState('');
  const [serviceId, setServiceId] = useState<ServiceId>('general_enquiry');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Icon resolver
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle':
        return HelpCircle;
      case 'FileCheck':
        return FileCheck;
      case 'CreditCard':
        return CreditCard;
      case 'Cpu':
        return Cpu;
      case 'Calendar':
        return Calendar;
      case 'Zap':
        return Zap;
      default:
        return FileText;
    }
  };

  // Calculate live position and people ahead for the active ticket
  const activeTokenInfo = useMemo(() => {
    if (!myActiveToken) return null;

    const waitingList = tokens
      .filter((t) => t.status === 'waiting')
      .sort((a, b) => {
        if (a.priority === 'priority' && b.priority !== 'priority') return -1;
        if (a.priority !== 'priority' && b.priority === 'priority') return 1;
        return a.joinedAt - b.joinedAt;
      });

    const indexInQueue = waitingList.findIndex((t) => t.id === myActiveToken.id);
    const position = indexInQueue !== -1 ? indexInQueue + 1 : 0;
    const peopleAhead = Math.max(0, position - 1);

    const servingToken = tokens.find((t) => t.id === myActiveToken.id && (t.status === 'serving' || t.status === 'called'));
    const isNowServing = !!servingToken;

    return {
      position,
      peopleAhead,
      isNowServing,
      totalWaiting: waitingList.length,
    };
  }, [myActiveToken, tokens]);

  // Handle Join Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name Required', 'Please enter your name to generate a token.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      joinQueue({
        name: name.trim(),
        serviceId,
        priority,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setIsSubmitting(false);
    }, 350);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share && myActiveToken) {
      navigator.share({
        title: `SmartQueue Token: ${myActiveToken.tokenNumber}`,
        text: `My queue position is #${activeTokenInfo?.position || 1} for ${myActiveToken.serviceName}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      addToast('Ticket Link Copied', 'Token details copied to clipboard.', 'info');
    }
  };

  // If user has an active token that is waiting, called, or serving
  if (myActiveToken && myActiveToken.status !== 'cancelled') {
    const isServing = myActiveToken.status === 'serving' || myActiveToken.status === 'called';
    const isCompleted = myActiveToken.status === 'completed';
    const isSkipped = myActiveToken.status === 'skipped';

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
        {/* Status Notification Header */}
        {isServing && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Radio className="w-6 h-6 text-white animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">IT'S YOUR TURN NOW!</h2>
                <p className="text-xs text-emerald-100">
                  Please proceed immediately to{' '}
                  <strong className="text-white underline">
                    {myActiveToken.assignedCounter ? `Counter ${myActiveToken.assignedCounter}` : 'Service Desk'}
                  </strong>
                  .
                </p>
              </div>
            </div>
            <button
              onClick={() => soundManager.playChime('call')}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>Replay Audio</span>
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Your Service is Complete</h3>
            <p className="text-xs text-slate-400">Thank you for using SmartQueue AI! We hope your visit was smooth.</p>
            <button
              onClick={() => leaveQueue(myActiveToken.id)}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
            >
              Get Another Token
            </button>
          </div>
        )}

        {isSkipped && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-amber-200">Your Turn Was Skipped</h3>
            <p className="text-xs text-slate-300">Staff attempted to call your token. Please speak with the front desk or request a new ticket.</p>
            <button
              onClick={() => leaveQueue(myActiveToken.id)}
              className="mt-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all"
            >
              Join Queue Again
            </button>
          </div>
        )}

        {/* The Digital Token Card (Modern Boarding-Pass Aesthetic) */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-800/95 to-slate-900 border border-slate-700 shadow-2xl overflow-hidden print:border-black print:text-black">
          {/* Top Notch Accents */}
          <div className="p-6 sm:p-8 bg-slate-900/80 border-b border-dashed border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Official Digital Pass</p>
                <h3 className="text-base font-extrabold text-white">SmartQueue AI Ticket</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  myActiveToken.priority === 'priority'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                }`}
              >
                {myActiveToken.priority === 'priority' ? 'VIP Priority Pass' : 'Standard Queue'}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isServing
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}
              >
                {myActiveToken.status}
              </span>
            </div>
          </div>

          {/* Ticket Core Content */}
          <div className="p-6 sm:p-10 space-y-8">
            <div className="text-center space-y-2">
              <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Your Assigned Token</p>
              <div className="inline-block py-2 px-8 rounded-2xl bg-slate-950/80 border border-slate-700/80 shadow-inner">
                <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  {myActiveToken.tokenNumber}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-300 pt-1">
                Issued for: <strong className="text-white">{myActiveToken.customerName}</strong>
              </p>
            </div>

            {/* Real-time Position & Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <Users className="w-5 h-5 text-indigo-400 mx-auto" />
                <p className="text-[11px] uppercase font-bold text-slate-400">Queue Position</p>
                <p className="text-2xl font-black font-mono text-white">
                  {isServing ? 'Calling Now' : `#${activeTokenInfo?.position || 1}`}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isServing ? 'At Service Desk' : `${activeTokenInfo?.peopleAhead || 0} people ahead of you`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <Clock className="w-5 h-5 text-cyan-400 mx-auto" />
                <p className="text-[11px] uppercase font-bold text-slate-400">Estimated Wait</p>
                <p className="text-2xl font-black font-mono text-cyan-400">
                  {isServing ? '0 min' : `~${myActiveToken.estimatedWaitMinutes} min`}
                </p>
                <p className="text-[10px] text-slate-400">Calculated by AI engine</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <FileText className="w-5 h-5 text-emerald-400 mx-auto" />
                <p className="text-[11px] uppercase font-bold text-slate-400">Service Category</p>
                <p className="text-sm font-bold text-white truncate px-2">{myActiveToken.serviceName}</p>
                <p className="text-[10px] text-slate-400">
                  {myActiveToken.assignedCounter ? `Counter ${myActiveToken.assignedCounter}` : 'Multi-Desk Dispatch'}
                </p>
              </div>
            </div>

            {/* Live Progress Bar */}
            {!isCompleted && !isSkipped && (
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Live Turn Progress</span>
                  <span className="text-cyan-400 font-mono">
                    {isServing
                      ? '100% (At Counter)'
                      : activeTokenInfo?.position === 1
                      ? '90% (You are next!)'
                      : `${Math.max(10, 100 - (activeTokenInfo?.position || 1) * 20)}%`}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-500"
                    style={{
                      width: isServing
                        ? '100%'
                        : activeTokenInfo?.position === 1
                        ? '90%'
                        : `${Math.max(15, 100 - (activeTokenInfo?.position || 1) * 18)}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center pt-1">
                  Keep this screen open or check the waiting hall TV display. We will chime when your token is called.
                </p>
              </div>
            )}

            {/* Quick Share / Print / Leave Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Ticket</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Ticket</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('live')}
                  className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>View Live TV Board</span>
                </button>

                {!isCompleted && !isSkipped && (
                  <button
                    onClick={() => setShowLeaveConfirm(true)}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Leave Queue</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Queue Confirmation Modal */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Leave the Queue?</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to cancel token <strong className="text-white">{myActiveToken.tokenNumber}</strong>? Your current position will be given to the next person.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  Keep My Place
                </button>
                <button
                  onClick={() => {
                    leaveQueue(myActiveToken.id);
                    setShowLeaveConfirm(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
                >
                  Confirm & Leave
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Otherwise, render the Join Queue Form
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          Instant Digital Registration
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Join the Queue</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Select your required service and receive a live digital token with AI wait-time estimation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
        >
          {/* Step 1: Customer Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Name *</span>
              </span>
              <span className="text-[10px] text-slate-500 normal-case">Required for ticket call</span>
            </label>
            <input
              id="customer-name-input"
              type="text"
              required
              placeholder="e.g. Jordan Mitchell"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Step 2: Select Service */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Select Service Category *</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">6 Desks Open</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {services.map((srv) => {
                const Icon = getServiceIcon(srv.iconName);
                const isSelected = serviceId === srv.id;
                return (
                  <div
                    key={srv.id}
                    id={`service-card-${srv.id}`}
                    onClick={() => setServiceId(srv.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {srv.name}
                        </p>
                        <span className="text-[10px] font-mono text-cyan-400 shrink-0">~{srv.avgDurationMinutes}m</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{srv.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Priority Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Priority Level</span>
              </span>
              <span className="text-[10px] text-slate-400">Select qualification</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div
                id="priority-opt-normal"
                onClick={() => setPriority('normal')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  priority === 'normal'
                    ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Standard Lane</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${priority === 'normal' ? 'border-blue-400 bg-blue-500' : 'border-slate-600'}`}>
                    {priority === 'normal' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">Regular walk-in & standard turnaround sequence.</p>
              </div>

              <div
                id="priority-opt-priority"
                onClick={() => setPriority('priority')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  priority === 'priority'
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Priority VIP
                  </span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${priority === 'priority' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'}`}>
                    {priority === 'priority' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">Elderly, medical triage, faculty, or fast-track pass.</p>
              </div>
            </div>
          </div>

          {/* Optional Details (Phone & Notes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>Mobile (Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>Special Instructions</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Urgent transcript verification"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="submit-join-queue-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Ticket className="w-4 h-4" />
            <span>{isSubmitting ? 'Generating Secure Token...' : 'Generate Digital Token Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Live Ticket Mockup Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Ticket Preview</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">
                Interactive Preview
              </span>
            </div>

            {/* Generated Mock Token Visual */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <p className="text-[10px] uppercase font-bold text-slate-400">Estimated Token Identifier</p>
              <p className="text-4xl font-black font-mono tracking-wider text-cyan-400">
                {priority === 'priority' ? 'PRI' : services.find((s) => s.id === serviceId)?.code || 'GEN'}-
                {tokens.reduce((max, t) => Math.max(max, t.numericSeq), 100) + 1}
              </p>
              <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-left text-xs">
                <div>
                  <p className="text-[10px] text-slate-500">Name</p>
                  <p className="font-semibold text-slate-200 truncate">{name || 'Your Name'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Service</p>
                  <p className="font-semibold text-slate-200 truncate">
                    {services.find((s) => s.id === serviceId)?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Waiting Estimates Preview */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>People Ahead of You</span>
                </span>
                <strong className="font-mono text-white">
                  {tokens.filter((t) => t.status === 'waiting').length}
                </strong>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Estimated Wait Time</span>
                </span>
                <strong className="font-mono text-cyan-400">
                  ~{priority === 'priority' ? '3-6' : `${services.find((s) => s.id === serviceId)?.avgDurationMinutes || 10}`} mins
                </strong>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tier Privilege</span>
                </span>
                <span className={`font-bold ${priority === 'priority' ? 'text-amber-400' : 'text-slate-300'}`}>
                  {priority === 'priority' ? 'VIP Priority Dispatch' : 'Standard'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 leading-relaxed">
              💡 SmartQueue AI will update your estimated turn in real-time as tickets are served at the counters.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
