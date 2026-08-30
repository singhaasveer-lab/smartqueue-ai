import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { PriorityLevel, ServiceId } from '../types';
import {
  Users,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Plus,
  Search,
  Zap,
  UserX,
  Volume2,
  Building2,
  X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    tokens,
    counters,
    services,
    analytics,
    callNext,
    completeCurrent,
    skipToken,
    recallToken,
    prioritizeToken,
    toggleCounterStatus,
    addCounter,
    resetToDemoData,
    fastAddDemoCustomer,
    joinQueue,
    addToast,
  } = useQueue();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'waiting' | 'serving' | 'priority' | 'completed' | 'skipped'
  >('waiting');

  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedCounterId, setSelectedCounterId] = useState<number>(1);

  const [showAddWalkin, setShowAddWalkin] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinService, setWalkinService] =
    useState<ServiceId>('general_enquiry');
  const [walkinPriority, setWalkinPriority] =
    useState<PriorityLevel>('normal');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinNotes, setWalkinNotes] = useState('');

  const [showAddCounterModal, setShowAddCounterModal] = useState(false);
  const [newCounterName, setNewCounterName] = useState('');
  const [newStaffName, setNewStaffName] = useState('');

  const servingTokens = tokens.filter(
    (token) =>
      token.status === 'serving' || token.status === 'called'
  );

  const waitingTokens = tokens.filter(
    (token) => token.status === 'waiting'
  );

  const filteredTokens = tokens
    .filter((token) => {
      if (
        selectedTab === 'waiting' &&
        token.status !== 'waiting'
      ) {
        return false;
      }

      if (
        selectedTab === 'serving' &&
        token.status !== 'serving' &&
        token.status !== 'called'
      ) {
        return false;
      }

      if (
        selectedTab === 'priority' &&
        token.priority !== 'priority'
      ) {
        return false;
      }

      if (
        selectedTab === 'completed' &&
        token.status !== 'completed'
      ) {
        return false;
      }

      if (
        selectedTab === 'skipped' &&
        token.status !== 'skipped'
      ) {
        return false;
      }

      if (
        selectedService !== 'all' &&
        token.serviceId !== selectedService
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();

        const matchName = token.customerName
          .toLowerCase()
          .includes(query);

        const matchToken = token.tokenNumber
          .toLowerCase()
          .includes(query);

        const matchPhone = token.customerPhone
          ?.toLowerCase()
          .includes(query);

        if (!matchName && !matchToken && !matchPhone) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (
        selectedTab === 'waiting' ||
        selectedTab === 'all'
      ) {
        if (
          a.status === 'waiting' &&
          b.status === 'waiting'
        ) {
          if (
            a.priority === 'priority' &&
            b.priority !== 'priority'
          ) {
            return -1;
          }

          if (
            a.priority !== 'priority' &&
            b.priority === 'priority'
          ) {
            return 1;
          }

          return a.joinedAt - b.joinedAt;
        }
      }

      return (
        (b.calledAt || b.joinedAt) -
        (a.calledAt || a.joinedAt)
      );
    });

  const handleWalkinSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!walkinName.trim()) {
      addToast(
        'Name Required',
        'Please enter customer name.',
        'warning'
      );
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
    setWalkinPriority('normal');
    setWalkinService('general_enquiry');
    setShowAddWalkin(false);

    addToast(
      'Walk-in Registered',
      'Added to queue list.',
      'success'
    );
  };

  const handleCreateCounter = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!newCounterName.trim()) {
      return;
    }

    addCounter(
      newCounterName.trim(),
      newStaffName.trim() || 'Staff Member'
    );

    setNewCounterName('');
    setNewStaffName('');
    setShowAddCounterModal(false);

    addToast(
      'Counter Added',
      'New service station is ready.',
      'success'
    );
  };

  const tabItems = [
    {
      id: 'waiting',
      label: 'Waiting Line',
      count: waitingTokens.length,
    },
    {
      id: 'serving',
      label: 'In Service',
      count: servingTokens.length,
    },
    {
      id: 'priority',
      label: 'Priority VIP',
      count: tokens.filter(
        (token) => token.priority === 'priority'
      ).length,
    },
    {
      id: 'all',
      label: 'All Records',
      count: tokens.length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: tokens.filter(
        (token) => token.status === 'completed'
      ).length,
    },
    {
      id: 'skipped',
      label: 'Skipped',
      count: tokens.filter(
        (token) => token.status === 'skipped'
      ).length,
    },
  ];

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
                <div className="mb-2 flex min-w-0 flex-wrap items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                    <Building2 className="h-5 w-5 text-[var(--accent)]" />
                  </div>

                  <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
                    Admin & Staff Dispatch Desk
                  </h1>

                  <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-100">
                    Control Center
                  </span>
                </div>

                <p className="max-w-2xl text-xs leading-relaxed text-blue-100/80 sm:text-sm">
                  Manage live multi-counter queues, dispatch the next
                  attendees, and trigger token notifications from one
                  central control panel.
                </p>
              </div>

              {/* QUICK ACTIONS */}
              <div className="flex min-w-0 flex-wrap gap-2">
                <button
                  id="admin-add-walkin-btn"
                  onClick={() => setShowAddWalkin(true)}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Plus className="h-4 w-4 text-blue-200" />
                  Add Walk-in
                </button>

                <button
                  id="admin-fast-demo-btn"
                  onClick={() => fastAddDemoCustomer(false)}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3.5 py-2.5 text-xs font-bold text-cyan-100 transition-all hover:bg-cyan-400/20"
                  title="Inject simulated customer into queue"
                >
                  <Users className="h-4 w-4" />
                  + Sim Visitor
                </button>

                <button
                  id="admin-fast-prio-btn"
                  onClick={() => fastAddDemoCustomer(true)}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-300/20 bg-amber-400/10 px-3.5 py-2.5 text-xs font-bold text-amber-100 transition-all hover:bg-amber-400/20"
                  title="Inject priority visitor"
                >
                  <Zap className="h-4 w-4" />
                  + Sim VIP
                </button>

                <button
                  onClick={resetToDemoData}
                  className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-blue-100/70 transition-all hover:bg-white/10 hover:text-white"
                  title="Reset to Demo State"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}
        <div className="mb-6 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2 text-[var(--muted)]">
              <span className="truncate text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                Total Waiting
              </span>
              <Users className="h-4 w-4 shrink-0 text-blue-500" />
            </div>

            <p className="mt-2 font-mono text-2xl font-black text-[var(--foreground)] sm:text-3xl">
              {analytics.totalWaiting}
            </p>

            <p className="mt-1 truncate text-[10px] text-[var(--muted)] sm:text-[11px]">
              <strong className="text-amber-500">
                {analytics.priorityCount}
              </strong>{' '}
              priority ticket
              {analytics.priorityCount === 1 ? '' : 's'}
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2 text-[var(--muted)]">
              <span className="truncate text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                Currently Serving
              </span>
              <Play className="h-4 w-4 shrink-0 text-emerald-500" />
            </div>

            <p className="mt-2 font-mono text-2xl font-black text-emerald-500 sm:text-3xl">
              {analytics.totalServing}
            </p>

            <p className="mt-1 truncate text-[10px] text-[var(--muted)] sm:text-[11px]">
              Across{' '}
              {
                counters.filter(
                  (counter) => counter.status !== 'closed'
                ).length
              }{' '}
              active desk stations
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2 text-[var(--muted)]">
              <span className="truncate text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                Avg Waiting Time
              </span>
              <Clock className="h-4 w-4 shrink-0 text-cyan-500" />
            </div>

            <p className="mt-2 font-mono text-2xl font-black text-cyan-500 sm:text-3xl">
              {analytics.avgWaitTimeMinutes}m
            </p>

            <p className="mt-1 truncate text-[10px] text-[var(--muted)] sm:text-[11px]">
              Estimated clear: ~
              {analytics.estimatedTimeToClearMinutes} mins
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2 text-[var(--muted)]">
              <span className="truncate text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                Served Today
              </span>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
            </div>

            <p className="mt-2 font-mono text-2xl font-black text-purple-500 sm:text-3xl">
              {analytics.totalServedToday}
            </p>

            <p className="mt-1 truncate text-[10px] text-[var(--muted)] sm:text-[11px]">
              {analytics.totalSkipped} skipped / no-show
            </p>
          </div>
        </div>

        {/* =====================================================
            COUNTER STATIONS
        ====================================================== */}
        <section className="mb-6 min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xl sm:p-6">

          <div className="mb-5 flex min-w-0 flex-col gap-4 border-b border-[var(--border)] pb-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 shrink-0 text-blue-500" />

                <h2 className="truncate text-base font-black text-[var(--foreground)] sm:text-lg">
                  Counter Station Controllers
                </h2>
              </div>

              <p className="mt-1 text-xs text-[var(--muted)]">
                Directly dispatch tokens to specific desk operators.
              </p>
            </div>

            <div className="flex min-w-0 flex-wrap gap-2">
              <button
                id="admin-call-next-global-btn"
                onClick={() => callNext(selectedCounterId)}
                className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg transition-all hover:from-blue-500 hover:to-indigo-500 sm:flex-none"
              >
                <Volume2 className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  Call Next to Selected Desk
                </span>
              </button>

              <button
                onClick={() => setShowAddCounterModal(true)}
                className="flex shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 py-2.5 text-xs font-bold text-[var(--foreground)] transition-all hover:opacity-80"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Desk
              </button>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {counters.map((counter) => {
              const servingToken = tokens.find(
                (token) =>
                  token.id === counter.currentServingTokenId
              );

              const isSelected =
                selectedCounterId === counter.id;

              return (
                <div
                  key={counter.id}
                  onClick={() =>
                    setSelectedCounterId(counter.id)
                  }
                  className={`
                    min-w-0 overflow-hidden rounded-2xl border p-4 transition-all sm:p-5
                    ${
                      counter.status === 'closed'
                        ? 'border-[var(--border)] bg-[var(--card-soft)] opacity-60'
                        : isSelected
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg ring-2 ring-blue-500/20'
                        : 'border-[var(--border)] bg-[var(--card)] hover:border-blue-400 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                          counter.status === 'closed'
                            ? 'bg-slate-400'
                            : isSelected
                            ? 'animate-pulse bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                      />

                      <span className="truncate text-sm font-black text-[var(--foreground)]">
                        {counter.name}
                      </span>
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleCounterStatus(counter.id);
                      }}
                      className={`
                        shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide transition-all
                        ${
                          counter.status === 'closed'
                            ? 'bg-slate-500/10 text-[var(--muted)] hover:bg-slate-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-300'
                        }
                      `}
                    >
                      {counter.status === 'closed'
                        ? 'Closed'
                        : 'Open'}
                    </button>
                  </div>

                  {servingToken ? (
                    <div className="mt-4 min-w-0 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">

                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]">
                            Current Token
                          </span>

                          <p className="mt-0.5 truncate font-mono text-2xl font-black text-[var(--foreground)]">
                            {servingToken.tokenNumber}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-300">
                          {servingToken.status}
                        </span>
                      </div>

                      <div className="mt-3 min-w-0">
                        <p className="truncate text-xs font-bold text-[var(--foreground)]">
                          {servingToken.customerName}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-[var(--muted)]">
                          {servingToken.serviceName}
                        </p>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-3">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            completeCurrent(servingToken.id);
                          }}
                          className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 text-[10px] font-bold text-white transition-all hover:bg-emerald-500"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Complete
                        </button>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            skipToken(servingToken.id);
                          }}
                          className="flex items-center justify-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] py-2 text-[10px] font-bold text-amber-600 transition-all hover:bg-amber-500/10 dark:text-amber-300"
                        >
                          <UserX className="h-3.5 w-3.5" />
                          Skip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card-soft)] p-4 text-center">
                      <p className="text-xs italic text-[var(--muted)]">
                        No attendee assigned
                      </p>

                      <button
                        disabled={counter.status === 'closed'}
                        onClick={(event) => {
                          event.stopPropagation();
                          callNext(counter.id);
                        }}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        Call Next Token
                      </button>
                    </div>
                  )}

                  <p className="mt-3 truncate text-[10px] text-[var(--muted)]">
                    Operator: {counter.staffName}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            QUEUE MANAGEMENT
        ====================================================== */}
        <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xl sm:p-6">

          <div className="mb-5 flex min-w-0 flex-col gap-4 border-b border-[var(--border)] pb-5 xl:flex-row xl:items-center xl:justify-between">

            {/* TABS */}
            <div className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-1">
              <div className="flex w-max items-center gap-1">
                {tabItems.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setSelectedTab(
                        tab.id as
                          | 'all'
                          | 'waiting'
                          | 'serving'
                          | 'priority'
                          | 'completed'
                          | 'skipped'
                      )
                    }
                    className={`
                      flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-bold transition-all sm:text-xs
                      ${
                        selectedTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--foreground)]'
                      }
                    `}
                  >
                    <span>{tab.label}</span>

                    <span
                      className={`
                        rounded-full px-1.5 py-0.5 font-mono text-[9px]
                        ${
                          selectedTab === tab.id
                            ? 'bg-white/20 text-white'
                            : 'bg-[var(--card)] text-[var(--muted)]'
                        }
                      `}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SEARCH + SERVICE FILTER */}
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />

                <input
                  type="text"
                  placeholder="Search token / name..."
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] py-2 pl-8 pr-3 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <select
                value={selectedService}
                onChange={(event) =>
                  setSelectedService(event.target.value)
                }
                className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="all">All Services</option>

                {services.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="min-w-0 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--card-soft)] text-[var(--muted)]">
                <tr className="text-[10px] uppercase tracking-wider">
                  <th className="px-4 py-3.5 font-bold">
                    Pos / Token
                  </th>
                  <th className="px-4 py-3.5 font-bold">
                    Customer
                  </th>
                  <th className="px-4 py-3.5 font-bold">
                    Service
                  </th>
                  <th className="px-4 py-3.5 font-bold">
                    Priority
                  </th>
                  <th className="px-4 py-3.5 font-bold">
                    Wait Time
                  </th>
                  <th className="px-4 py-3.5 font-bold">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-right font-bold">
                    Desk Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border)]">
                {filteredTokens.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-14 text-center text-[var(--muted)]"
                    >
                      <Users className="mx-auto mb-2 h-7 w-7 opacity-30" />
                      No matching queue entries found.
                    </td>
                  </tr>
                ) : (
                  filteredTokens.map((token, index) => {
                    const isServing =
                      token.status === 'serving' ||
                      token.status === 'called';

                    const isWaiting =
                      token.status === 'waiting';

                    return (
                      <tr
                        key={token.id}
                        className={`
                          transition-colors hover:bg-[var(--card-soft)]
                          ${
                            token.priority === 'priority'
                              ? 'bg-amber-500/5'
                              : ''
                          }
                        `}
                      >
                        {/* TOKEN */}
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--card-soft)] font-mono text-[10px] font-bold text-[var(--muted)]">
                              {isWaiting ? index + 1 : '—'}
                            </span>

                            <span className="font-mono text-sm font-black text-[var(--foreground)]">
                              {token.tokenNumber}
                            </span>
                          </div>
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-4 py-3.5">
                          <div className="min-w-0 max-w-[180px]">
                            <p className="truncate font-bold text-[var(--foreground)]">
                              {token.customerName}
                            </p>

                            {token.customerPhone && (
                              <p className="truncate text-[10px] text-[var(--muted)]">
                                {token.customerPhone}
                              </p>
                            )}

                            {token.notes && (
                              <p className="truncate text-[10px] italic text-blue-500 dark:text-blue-300">
                                {token.notes}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* SERVICE */}
                        <td className="px-4 py-3.5">
                          <span className="whitespace-nowrap font-medium text-[var(--foreground)]">
                            {token.serviceName}
                          </span>
                        </td>

                        {/* PRIORITY */}
                        <td className="whitespace-nowrap px-4 py-3.5">
                          {token.priority === 'priority' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                              <Zap className="h-3 w-3 text-amber-500" />
                              VIP Priority
                            </span>
                          ) : (
                            <span className="rounded-full bg-[var(--card-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--muted)]">
                              Standard
                            </span>
                          )}
                        </td>

                        {/* WAIT */}
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <div className="flex items-center gap-1 font-mono font-semibold text-cyan-500">
                            <Clock className="h-3 w-3 text-[var(--muted)]" />

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

                        {/* STATUS */}
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <span
                            className={`
                              rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider
                              ${
                                token.status === 'serving'
                                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                                  : token.status === 'called'
                                  ? 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300'
                                  : token.status === 'waiting'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300'
                                  : token.status === 'completed'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300'
                                  : token.status === 'skipped'
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
                                  : 'bg-[var(--card-soft)] text-[var(--muted)]'
                              }
                            `}
                          >
                            {token.status}

                            {token.assignedCounter
                              ? ` (Desk ${token.assignedCounter})`
                              : ''}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">

                            {isWaiting && (
                              <>
                                <button
                                  onClick={() =>
                                    recallToken(
                                      token.id,
                                      selectedCounterId
                                    )
                                  }
                                  className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-blue-500"
                                >
                                  <Volume2 className="h-3 w-3" />
                                  Call
                                </button>

                                {token.priority !==
                                  'priority' && (
                                  <button
                                    onClick={() =>
                                      prioritizeToken(
                                        token.id
                                      )
                                    }
                                    className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-1.5 text-[var(--muted)] transition-all hover:bg-amber-500/10 hover:text-amber-500"
                                    title="Upgrade to VIP Priority"
                                  >
                                    <Zap className="h-3.5 w-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    skipToken(token.id)
                                  }
                                  className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-1.5 text-[var(--muted)] transition-all hover:bg-rose-500/10 hover:text-rose-500"
                                  title="Mark as Skipped"
                                >
                                  <UserX className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}

                            {isServing && (
                              <>
                                <button
                                  onClick={() =>
                                    completeCurrent(
                                      token.id
                                    )
                                  }
                                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-emerald-500"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Complete
                                </button>

                                <button
                                  onClick={() =>
                                    skipToken(token.id)
                                  }
                                  className="rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[10px] font-bold text-amber-600 transition-all hover:bg-amber-500/20 dark:text-amber-300"
                                >
                                  Skip
                                </button>
                              </>
                            )}

                            {token.status === 'skipped' && (
                              <button
                                onClick={() =>
                                  recallToken(
                                    token.id,
                                    selectedCounterId
                                  )
                                }
                                className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[10px] font-bold text-amber-600 transition-all hover:bg-amber-500/20 dark:text-amber-300"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Recall
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
        </section>
      </div>

      {/* =========================================================
          WALK-IN MODAL
      ========================================================== */}
      {showAddWalkin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleWalkinSubmit}
            className="my-4 w-full max-w-lg space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <Plus className="h-5 w-5 text-blue-500" />
                </div>

                <h3 className="truncate text-base font-black text-[var(--foreground)]">
                  Manual Walk-In Registration
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowAddWalkin(false)}
                className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition-all hover:bg-[var(--card-soft)] hover:text-[var(--foreground)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--foreground)]">
                Customer Full Name *
              </label>

              <input
                type="text"
                required
                placeholder="e.g. Rachel Adams"
                value={walkinName}
                onChange={(event) =>
                  setWalkinName(event.target.value)
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--foreground)]">
                  Service Category
                </label>

                <select
                  value={walkinService}
                  onChange={(event) =>
                    setWalkinService(
                      event.target.value as ServiceId
                    )
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2.5 text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  {services.map((service) => (
                    <option
                      key={service.id}
                      value={service.id}
                    >
                      {service.name} (~
                      {service.avgDurationMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--foreground)]">
                  Priority Tier
                </label>

                <select
                  value={walkinPriority}
                  onChange={(event) =>
                    setWalkinPriority(
                      event.target.value as PriorityLevel
                    )
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2.5 text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="normal">
                    Standard Walk-in
                  </option>

                  <option value="priority">
                    ⭐ VIP Priority Pass
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--foreground)]">
                Phone Number (Optional)
              </label>

              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={walkinPhone}
                onChange={(event) =>
                  setWalkinPhone(event.target.value)
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--foreground)]">
                Staff Note / Reason
              </label>

              <input
                type="text"
                placeholder="e.g. Senior citizen fast-track"
                value={walkinNotes}
                onChange={(event) =>
                  setWalkinNotes(event.target.value)
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowAddWalkin(false)}
                className="rounded-xl bg-[var(--card-soft)] px-4 py-2.5 text-xs font-bold text-[var(--foreground)] transition-all hover:opacity-80"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-blue-500"
              >
                Generate Token & Place in Line
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================
          ADD COUNTER MODAL
      ========================================================== */}
      {showAddCounterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCreateCounter}
            className="my-4 w-full max-w-md space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <Building2 className="h-5 w-5 text-blue-500" />
                </div>

                <h3 className="truncate text-base font-black text-[var(--foreground)]">
                  Create New Service Counter
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddCounterModal(false)
                }
                className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition-all hover:bg-[var(--card-soft)] hover:text-[var(--foreground)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--foreground)]">
                Desk / Station Name *
              </label>

              <input
                type="text"
                required
                placeholder="e.g. Counter 4 - Specialist Desk"
                value={newCounterName}
                onChange={(event) =>
                  setNewCounterName(event.target.value)
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--foreground)]">
                Assigned Staff Name
              </label>

              <input
                type="text"
                placeholder="e.g. Alex Henderson"
                value={newStaffName}
                onChange={(event) =>
                  setNewStaffName(event.target.value)
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setShowAddCounterModal(false)
                }
                className="rounded-xl bg-[var(--card-soft)] px-4 py-2.5 text-xs font-bold text-[var(--foreground)] transition-all hover:opacity-80"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-blue-500"
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