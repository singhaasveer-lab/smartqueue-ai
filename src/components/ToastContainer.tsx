import React from 'react';
import { useQueue } from '../context/QueueContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useQueue();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderStyle = 'border-blue-500/30 bg-slate-900/95 text-blue-100 shadow-blue-500/10';
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderStyle = 'border-emerald-500/30 bg-slate-900/95 text-emerald-100 shadow-emerald-500/10';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderStyle = 'border-amber-500/30 bg-slate-900/95 text-amber-100 shadow-amber-500/10';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'alert') {
          Icon = AlertCircle;
          borderStyle = 'border-rose-500/40 bg-slate-900/95 text-rose-100 shadow-rose-500/20 animate-pulse';
          iconColor = 'text-rose-400';
        }

        return (
          <div
            key={toast.id}
            id={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 ${borderStyle}`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-tight text-white">{toast.title}</p>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
