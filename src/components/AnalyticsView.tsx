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
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { analytics, tokens, counters, services, addToast } = useQueue();

  const handleExportCSV = () => {
    try {
      const headers = ['Token Number', 'Customer Name', 'Service', 'Priority', 'Status', 'Joined Time', 'Wait Minutes', 'Assigned Counter'];
      const rows = tokens.map((t) => [
        t.tokenNumber,
        `"${t.customerName.replace(/"/g, '""')}"`,
        `"${t.serviceName}"`,
        t.priority,
        t.status,
        new Date(t.joinedAt).toLocaleTimeString(),
        t.estimatedWaitMinutes || 0,
        t.assignedCounter || 'N/A',
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `smartqueue_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('CSV Exported', 'Downloaded queue performance report.', 'success');
    } catch {
      addToast('Export Error', 'Could not generate CSV file.', 'warning');
    }
  };

  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ analytics, tokens, counters }, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `smartqueue_analytics_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('JSON Exported', 'Full dataset exported successfully.', 'success');
    } catch {
      addToast('Export Error', 'Could not export JSON.', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header & Export Tools */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Queue Analytics & Performance
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical wait time trends, customer throughput velocity, and service categorization metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Raw JSON</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
          <p className="text-2xl font-black font-mono text-white">{analytics.totalServedToday}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400">Served Today</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <Clock className="w-4 h-4 text-cyan-400 mx-auto" />
          <p className="text-2xl font-black font-mono text-cyan-400">{analytics.avgWaitTimeMinutes}m</p>
          <p className="text-[10px] uppercase font-bold text-slate-400">Avg Wait Time</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <TrendingUp className="w-4 h-4 text-indigo-400 mx-auto" />
          <p className="text-2xl font-black font-mono text-indigo-300">{analytics.avgServiceTimeMinutes}m</p>
          <p className="text-[10px] uppercase font-bold text-slate-400">Avg Service Time</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <Users className="w-4 h-4 text-purple-400 mx-auto" />
          <p className="text-2xl font-black font-mono text-purple-300">{analytics.peakQueueSize}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400">Peak Queue Size</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <Zap className="w-4 h-4 text-amber-400 mx-auto" />
          <p className="text-2xl font-black font-mono text-amber-300">{analytics.priorityPercentage}%</p>
          <p className="text-[10px] uppercase font-bold text-slate-400">Priority Ratio</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <Sparkles className="w-4 h-4 text-rose-400 mx-auto" />
          <p className="text-2xl font-black font-mono text-rose-300">{analytics.totalSkipped}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400">Skipped / No-Show</p>
        </div>
      </div>

      {/* Main Charts & Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Traffic Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Hourly Queue Traffic & Throughput
              </h2>
              <p className="text-xs text-slate-400">Arrivals vs completed attendees per hour</p>
            </div>
            <span className="text-xs text-indigo-400 font-mono">Today's Cycle</span>
          </div>

          {/* Bar Histogram Chart */}
          <div className="h-48 flex items-end justify-between gap-4 pt-6 pb-2 px-2">
            {analytics.hourlyTraffic.map((item, idx) => {
              const maxVal = Math.max(...analytics.hourlyTraffic.map((h) => Math.max(h.joined, h.served, 1)));
              const joinedHeight = Math.max(12, (item.joined / maxVal) * 100);
              const servedHeight = Math.max(8, (item.served / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    {/* Joined bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all duration-500 group-hover:brightness-125 relative"
                      style={{ height: `${joinedHeight}%` }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.joined}
                      </span>
                    </div>

                    {/* Served bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-500 group-hover:brightness-125 relative"
                      style={{ height: `${servedHeight}%` }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.served}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                    {item.hour}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-500" />
              <span>Visitor Arrivals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span>Tokens Served</span>
            </div>
          </div>
        </div>

        {/* Priority vs Normal Donut / Distribution (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Priority vs Standard Load
              </h2>
              <p className="text-xs text-slate-400">VIP priority traffic ratio</p>
            </div>
            <span className="text-xs text-amber-400 font-mono">{analytics.priorityPercentage}% VIP</span>
          </div>

          {/* Graphical Split Card */}
          <div className="space-y-4 py-2">
            {/* Visual ratio bar */}
            <div className="h-6 w-full rounded-xl bg-slate-950 overflow-hidden flex border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-black"
                style={{ width: `${Math.max(10, analytics.priorityPercentage)}%` }}
              >
                {analytics.priorityPercentage > 15 ? `${analytics.priorityPercentage}% VIP` : ''}
              </div>
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${100 - Math.max(10, analytics.priorityPercentage)}%` }}
              >
                {100 - analytics.priorityPercentage}% Standard
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Priority VIP
                </span>
                <p className="text-xl font-black font-mono text-white">{analytics.priorityCount}</p>
                <p className="text-[10px] text-slate-400">Avg turnaround ~4 mins</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Standard Lane
                </span>
                <p className="text-xl font-black font-mono text-white">{analytics.normalCount}</p>
                <p className="text-[10px] text-slate-400">Avg turnaround ~11 mins</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Priority tokens are prioritized at desk dispatching while maintaining fair distribution for standard walk-ins.
            </p>
          </div>
        </div>
      </div>

      {/* Service-Wise Breakdown Table & Performance */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Service-Wise Distribution & Demand</span>
            </h2>
            <p className="text-xs text-slate-400">Volume and average handling duration by category</p>
          </div>
          <span className="text-xs text-slate-400">{services.length} Service Categories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.serviceDistribution.map((srv) => (
            <div
              key={srv.serviceId}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white truncate">{srv.serviceName}</h3>
                <span className="text-xs font-mono font-black text-cyan-400">{srv.count} Tokens</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.max(5, srv.percentage)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{srv.percentage}% of total</span>
                  <span>~{srv.avgWaitMinutes}m avg wait</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
