import React from 'react';
import { useQueue } from '../context/QueueContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
  Zap,
  Download,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    analytics,
    tokens,
    services,
    addToast,
  } = useQueue();

  const handleExportCSV = () => {
    try {
      const headers = [
        'Token Number',
        'Customer Name',
        'Service',
        'Priority',
        'Status',
        'Joined Time',
        'Wait Minutes',
        'Assigned Counter',
      ];

      const rows = tokens.map((t) => [
        t.tokenNumber,
        `"${t.customerName.replace(/"/g, '""')}"`,
        `"${t.serviceName.replace(/"/g, '""')}"`,
        t.priority,
        t.status,
        new Date(t.joinedAt).toLocaleTimeString(),
        t.estimatedWaitMinutes || 0,
        t.assignedCounter || 'N/A',
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [
          headers.join(','),
          ...rows.map((row) => row.join(',')),
        ].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');

      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `smartqueue_report_${new Date()
          .toISOString()
          .slice(0, 10)}.csv`
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast(
        'CSV Exported',
        'Downloaded queue performance report.',
        'success'
      );
    } catch {
      addToast(
        'Export Error',
        'Could not generate CSV file.',
        'warning'
      );
    }
  };

  const handleExportJSON = () => {
    try {
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(
          JSON.stringify(
            {
              analytics,
              tokens,
            },
            null,
            2
          )
        );

      const link = document.createElement('a');

      link.setAttribute('href', dataStr);
      link.setAttribute(
        'download',
        `smartqueue_analytics_${Date.now()}.json`
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast(
        'JSON Exported',
        'Full dataset exported successfully.',
        'success'
      );
    } catch {
      addToast(
        'Export Error',
        'Could not export JSON.',
        'warning'
      );
    }
  };

  const maxHourlyValue = Math.max(
    1,
    ...analytics.hourlyTraffic.map((item) =>
      Math.max(item.joined, item.served, 1)
    )
  );

  const priorityPercentage = Math.max(
    0,
    Math.min(100, analytics.priorityPercentage)
  );

  const priorityBarPercentage = Math.max(
    10,
    priorityPercentage
  );

  const standardBarPercentage = Math.max(
    0,
    100 - priorityBarPercentage
  );

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl min-w-0 px-3 py-5 sm:px-5 sm:py-7 lg:px-6 lg:py-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
          <div className="bg-gradient-to-r from-[#163a5f] via-[#163a5f] to-[#315b87] dark:from-[#0d213a] dark:via-[#0d213a] dark:to-[#173b5d] px-5 py-6 text-white sm:px-7">
            <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="min-w-0">
                <div className="mb-2 flex min-w-0 items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                    <BarChart3 className="h-5 w-5 text-blue-200" />
                  </div>

                  <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
                    Queue Analytics & Performance
                  </h1>
                </div>

                <p className="max-w-3xl text-xs leading-relaxed text-blue-100/80 sm:text-sm">
                  Historical wait time trends, customer throughput velocity,
                  and service categorization metrics.
                </p>
              </div>

              {/* EXPORT ACTIONS */}
              <div className="flex min-w-0 flex-wrap gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Download className="h-3.5 w-3.5 text-blue-200" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-cyan-200/20 bg-cyan-300/10 px-3.5 py-2.5 text-xs font-bold text-cyan-100 transition-all hover:bg-cyan-300/20"
                >
                  <Download className="h-3.5 w-3.5 text-cyan-200" />
                  <span>Export Raw JSON</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}
        <section className="mb-6 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center shadow-md">
            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />

            <p className="mt-2 truncate font-mono text-2xl font-black text-[var(--foreground)]">
              {analytics.totalServedToday}
            </p>

            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
              Served Today
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center shadow-md">
            <Clock className="mx-auto h-4 w-4 text-cyan-500" />

            <p className="mt-2 truncate font-mono text-2xl font-black text-cyan-500">
              {analytics.avgWaitTimeMinutes}m
            </p>

            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
              Avg Wait Time
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center shadow-md">
            <TrendingUp className="mx-auto h-4 w-4 text-indigo-500" />

            <p className="mt-2 truncate font-mono text-2xl font-black text-indigo-500">
              {analytics.avgServiceTimeMinutes}m
            </p>

            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
              Avg Service Time
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center shadow-md">
            <Users className="mx-auto h-4 w-4 text-purple-500" />

            <p className="mt-2 truncate font-mono text-2xl font-black text-purple-500">
              {analytics.peakQueueSize}
            </p>

            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
              Peak Queue Size
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center shadow-md">
            <Zap className="mx-auto h-4 w-4 text-amber-500" />

            <p className="mt-2 truncate font-mono text-2xl font-black text-amber-500">
              {analytics.priorityPercentage}%
            </p>

            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
              Priority Ratio
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center shadow-md">
            <Sparkles className="mx-auto h-4 w-4 text-rose-500" />

            <p className="mt-2 truncate font-mono text-2xl font-black text-rose-500">
              {analytics.totalSkipped}
            </p>

            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
              Skipped / No-Show
            </p>
          </div>
        </section>

        {/* =====================================================
            CHARTS
        ====================================================== */}
        <section className="mb-6 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12">

          {/* HOURLY TRAFFIC */}
          <div className="min-w-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl sm:p-6 lg:col-span-7">

            <div className="mb-5 flex min-w-0 flex-col gap-2 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Hourly Queue Traffic & Throughput
                </h2>

                <p className="mt-1 text-[10px] text-[var(--muted)] sm:text-xs">
                  Arrivals vs completed attendees per hour
                </p>
              </div>

              <span className="shrink-0 font-mono text-[10px] text-indigo-500 sm:text-xs">
                Today's Cycle
              </span>
            </div>

            {/* HISTOGRAM */}
            <div className="h-56 w-full min-w-0 overflow-hidden">

              <div className="flex h-44 min-w-0 items-end gap-1.5 px-1 sm:gap-2 sm:px-2">
                {analytics.hourlyTraffic.map((item, idx) => {
                  const joinedHeight = Math.max(
                    10,
                    (item.joined / maxHourlyValue) * 100
                  );

                  const servedHeight = Math.max(
                    8,
                    (item.served / maxHourlyValue) * 100
                  );

                  return (
                    <div
                      key={idx}
                      className="group flex min-w-0 flex-1 flex-col items-center"
                    >
                      <div className="flex h-36 w-full items-end justify-center gap-0.5 sm:gap-1">

                        <div
                          className="relative w-1/2 rounded-t-md bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all duration-500 group-hover:brightness-110"
                          style={{
                            height: `${joinedHeight}%`,
                          }}
                        >
                          <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 font-mono text-[9px] font-bold text-cyan-600 dark:text-cyan-300 sm:block">
                            {item.joined}
                          </span>
                        </div>

                        <div
                          className="relative w-1/2 rounded-t-md bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-500 group-hover:brightness-110"
                          style={{
                            height: `${servedHeight}%`,
                          }}
                        >
                          <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-300 sm:block">
                            {item.served}
                          </span>
                        </div>
                      </div>

                      <span className="mt-2 max-w-full truncate font-mono text-[8px] text-[var(--muted)] sm:text-[10px]">
                        {item.hour}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LEGEND */}
            <div className="flex flex-wrap items-center justify-center gap-5 border-t border-[var(--border)] pt-4 text-[10px] text-[var(--muted)] sm:text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-indigo-500" />
                <span>Visitor Arrivals</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-emerald-500" />
                <span>Tokens Served</span>
              </div>
            </div>
          </div>

          {/* PRIORITY LOAD */}
          <div className="min-w-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl sm:p-6 lg:col-span-5">

            <div className="mb-5 flex min-w-0 items-start justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Priority vs Standard Load
                </h2>

                <p className="mt-1 text-[10px] text-[var(--muted)] sm:text-xs">
                  VIP priority traffic ratio
                </p>
              </div>

              <span className="shrink-0 font-mono text-[10px] text-amber-500 sm:text-xs">
                {analytics.priorityPercentage}% VIP
              </span>
            </div>

            <div className="space-y-5">

              {/* RATIO BAR */}
              <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-soft)]">
                <div className="flex h-7 w-full">

                  <div
                    className="flex min-w-0 items-center justify-center bg-gradient-to-r from-amber-400 to-orange-500 px-1 text-[9px] font-bold text-slate-950 transition-all duration-700"
                    style={{
                      width: `${priorityBarPercentage}%`,
                    }}
                  >
                    <span className="truncate">
                      {analytics.priorityPercentage > 15
                        ? `${analytics.priorityPercentage}% VIP`
                        : ''}
                    </span>
                  </div>

                  <div
                    className="flex min-w-0 items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 px-1 text-[9px] font-bold text-white transition-all duration-700"
                    style={{
                      width: `${standardBarPercentage}%`,
                    }}
                  >
                    <span className="truncate">
                      {100 - analytics.priorityPercentage}% Standard
                    </span>
                  </div>
                </div>
              </div>

              {/* LOAD CARDS */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="min-w-0 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-300">
                    <Zap className="h-3 w-3" />
                    Priority VIP
                  </span>

                  <p className="mt-2 font-mono text-2xl font-black text-[var(--foreground)]">
                    {analytics.priorityCount}
                  </p>

                  <p className="mt-1 text-[10px] text-[var(--muted)]">
                    Avg turnaround ~4 mins
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-blue-600 dark:text-blue-300">
                    <Users className="h-3 w-3" />
                    Standard Lane
                  </span>

                  <p className="mt-2 font-mono text-2xl font-black text-[var(--foreground)]">
                    {analytics.normalCount}
                  </p>

                  <p className="mt-1 text-[10px] text-[var(--muted)]">
                    Avg turnaround ~11 mins
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
                <p className="text-[11px] leading-relaxed text-[var(--muted)]">
                  Priority tokens are prioritized at desk dispatching while
                  maintaining fair distribution for standard walk-ins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SERVICE BREAKDOWN
        ====================================================== */}
        <section className="min-w-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl sm:p-6">

          <div className="mb-5 flex min-w-0 flex-col gap-2 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="flex min-w-0 items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                <Layers className="h-4 w-4 shrink-0 text-cyan-500" />

                <span className="truncate">
                  Service-Wise Distribution & Demand
                </span>
              </h2>

              <p className="mt-1 text-[10px] text-[var(--muted)] sm:text-xs">
                Volume and average handling duration by category
              </p>
            </div>

            <span className="shrink-0 text-[10px] text-[var(--muted)] sm:text-xs">
              {services.length} Service Categories
            </span>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {analytics.serviceDistribution.map((srv) => (
              <div
                key={srv.serviceId}
                className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] p-4 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <h3 className="min-w-0 truncate text-xs font-bold text-[var(--foreground)]">
                    {srv.serviceName}
                  </h3>

                  <span className="shrink-0 font-mono text-[10px] font-black text-cyan-500">
                    {srv.count} Tokens
                  </span>
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--card)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                      style={{
                        width: `${Math.max(
                          5,
                          Math.min(100, srv.percentage)
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-[var(--muted)]">
                    <span>{srv.percentage}% of total</span>

                    <span>
                      ~{srv.avgWaitMinutes}m avg wait
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {analytics.serviceDistribution.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
                <Layers className="mx-auto mb-2 h-7 w-7 text-[var(--muted)]" />

                <p className="text-sm font-bold text-[var(--foreground)]">
                  No service data available
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Queue activity will appear here once customers are added.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};