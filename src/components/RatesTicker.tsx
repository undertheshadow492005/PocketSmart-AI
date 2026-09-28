import React from 'react';
import { GoldRatesResponse } from '../types';
import { TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

interface RatesTickerProps {
  ratesData: GoldRatesResponse | null;
  currency: 'INR' | 'USD';
}

export const RatesTicker: React.FC<RatesTickerProps> = ({ ratesData, currency }) => {
  const rates = ratesData?.rates;

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> India Bullion Benchmark
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Updated: {ratesData?.last_updated || 'Today'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-medium">Gold 24K:</span>
            <span className="font-bold text-white">₹{rates ? rates.gold_24k_per_gram.toLocaleString('en-IN') : '7,520'}/g</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-amber-300 font-medium">Gold 22K (916):</span>
            <span className="font-bold text-amber-100">₹{rates ? rates.gold_22k_per_gram.toLocaleString('en-IN') : '6,890'}/g</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-medium">Gold 18K:</span>
            <span className="font-bold text-white">₹{rates ? rates.gold_18k_per_gram.toLocaleString('en-IN') : '5,640'}/g</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Silver:</span>
            <span className="font-bold text-white">₹{rates ? rates.silver_per_gram : '94'}/g</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
            <span>Exchange:</span>
            <span className="text-slate-200 font-semibold">1 USD = ₹86.50</span>
          </div>

          <div className="hidden xl:flex items-center gap-1 text-sky-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BIS Hallmarking Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
