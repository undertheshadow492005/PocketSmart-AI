import React from 'react';
import { HistoryItem } from '../types';
import { formatINR } from '../utils/formatters';
import { History, Trash2, ExternalLink, Home, PartyPopper, Gem, Calendar, ArrowRight } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectPlan: (item: HistoryItem) => void;
  onDeletePlan: (id: string) => void;
  currency: 'INR' | 'USD';
  exchangeRate?: number;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectPlan,
  onDeletePlan,
  currency,
  exchangeRate = 86.5,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 rounded-2xl border border-amber-800/40 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
          <History className="w-3.5 h-3.5" /> Session Tracking &amp; History
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Saved Recommendations &amp; Calculations
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Review previous budget allocations and recommendations generated during your session. Re-open any past scenario with a single click.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <History className="w-8 h-8" />
          </div>
          <div className="max-w-md">
            <h3 className="text-base font-bold text-white">No Saved Plans Yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Generate a Home Interior, Party Budget, or Jewelry recommendation and it will automatically be archived here for your review and re-use.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map(item => {
            const icon =
              item.scenario === 'home' ? (
                <Home className="w-4 h-4 text-blue-400" />
              ) : item.scenario === 'party' ? (
                <PartyPopper className="w-4 h-4 text-emerald-400" />
              ) : (
                <Gem className="w-4 h-4 text-purple-400" />
              );

            const badgeBg =
              item.scenario === 'home'
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                : item.scenario === 'party'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-purple-500/10 text-purple-300 border-purple-500/20';

            return (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${badgeBg}`}>
                        {icon}
                        <span>{item.scenario}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onDeletePlan(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-white line-clamp-1">{item.title}</h3>

                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-slate-400">Budget:</span>
                    <span className="font-bold text-emerald-400">
                      {formatINR(item.budget, currency, exchangeRate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onSelectPlan(item)}
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Plan Results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
