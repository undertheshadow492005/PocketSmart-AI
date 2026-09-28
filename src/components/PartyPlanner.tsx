import React, { useState } from 'react';
import { PartyBudgetResponse } from '../types';
import { BudgetPieChart } from './BudgetPieChart';
import { ShoppingLinksBadges } from './ShoppingLinksBadges';
import { formatINR, generateWhatsAppLink, printBudgetSummary } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  PartyPopper,
  Users,
  Utensils,
  Hotel,
  Music,
  Gift,
  Sparkles,
  Calculator,
  Share2,
  Printer,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface PartyPlannerProps {
  currency: 'INR' | 'USD';
  exchangeRate?: number;
}

const PARTY_PRESETS = [
  {
    label: 'Kids Birthday (40 Guests • ₹25k)',
    budget: 25000,
    type: 'Birthday Party',
    guests: 40,
    venue: 'Community Hall / Home Lawn',
    catering: true,
    decor: true,
    fun: true,
    notes: 'Include chocolate theme cake, mini burgers/pizza combo trays, DIY balloon arch, and return gifts.',
  },
  {
    label: 'College Farewell (60 Guests • ₹30k)',
    budget: 30000,
    type: 'College Farewell',
    guests: 60,
    venue: 'Rooftop Cafe / Banquet Room',
    catering: true,
    decor: true,
    fun: true,
    notes: 'Party snacks box via Zomato/Swiggy, photo backdrop for polaroids, Bluetooth DJ setup.',
  },
  {
    label: 'Silver Anniversary (50 Guests • ₹60k)',
    budget: 60000,
    type: 'Anniversary Celebration',
    guests: 50,
    venue: 'Rented Banquet Hall',
    catering: true,
    decor: true,
    fun: true,
    notes: 'Grand dinner buffet, fairy light photo wall, anniversary cake, live acoustic/mic rental.',
  },
];

export const PartyPlanner: React.FC<PartyPlannerProps> = ({ currency, exchangeRate = 86.5 }) => {
  // Form State
  const [budget, setBudget] = useState<number>(30000);
  const [partyType, setPartyType] = useState<string>('Birthday Party');
  const [numGuests, setNumGuests] = useState<number>(40);
  const [venueType, setVenueType] = useState<string>('Rented Banquet Hall');
  const [needsCatering, setNeedsCatering] = useState<boolean>(true);
  const [needsDecoration, setNeedsDecoration] = useState<boolean>(true);
  const [needsEntertainment, setNeedsEntertainment] = useState<boolean>(true);
  const [additionalReqs, setAdditionalReqs] = useState<string>('');

  // Results State
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PartyBudgetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const costPerHeadPreview = Math.round(budget / Math.max(numGuests, 1));

  const loadPreset = (preset: typeof PARTY_PRESETS[0]) => {
    setBudget(preset.budget);
    setPartyType(preset.type);
    setNumGuests(preset.guests);
    setVenueType(preset.venue);
    setNeedsCatering(preset.catering);
    setNeedsDecoration(preset.decor);
    setNeedsEntertainment(preset.fun);
    setAdditionalReqs(preset.notes);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_budget: budget,
          party_type: partyType,
          num_guests: numGuests,
          venue_type: venueType,
          needs_catering: needsCatering,
          needs_decoration: needsDecoration,
          needs_entertainment: needsEntertainment,
          additional_requirements: additionalReqs,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate party budget plan');
      }

      const data: PartyBudgetResponse = await response.json();
      setResult(data);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while connecting to Gemini AI');
    } finally {
      setLoading(false);
    }
  };

  const shareWhatsApp = () => {
    if (!result) return;
    const text = `🎉 *PocketSmartAI - Party Budget Allocation*
*Event:* ${partyType} for ${result.guest_count} Guests
*Total Budget:* ₹${result.total_budget.toLocaleString('en-IN')}
*Cost Per Head:* ₹${result.cost_per_head.toLocaleString('en-IN')}/guest

*Allocation Breakdown:*
${result.budget_breakdown.map(c => `• ${c.category}: ₹${c.allocation.toLocaleString('en-IN')}`).join('\n')}

*AI Advice:* ${result.smart_alert}
Plan generated with PocketSmartAI • Naan Mudhalvan Project`;
    window.open(generateWhatsAppLink(text), '_blank');
  };

  const handlePrint = () => {
    if (!result) return;
    const content = `
      <h2>${partyType} Planning Report</h2>
      <p><strong>Total Budget:</strong> ₹${result.total_budget.toLocaleString('en-IN')} | <strong>Guests:</strong> ${result.guest_count} | <strong>Cost Per Head:</strong> ₹${result.cost_per_head.toLocaleString('en-IN')}</p>
      <p style="background: #fef3c7; color: #92400e; padding: 10px; border-radius: 6px;"><strong>Smart Alert:</strong> ${result.smart_alert}</p>
      <h3>Budget Split</h3>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Items Count</th>
            <th>Total Cost (₹)</th>
            <th>Share (%)</th>
          </tr>
        </thead>
        <tbody>
          ${result.calculation_table
            .map(
              t => `<tr>
            <td>${t.category}</td>
            <td>${t.items_count}</td>
            <td>₹${t.total_cost.toLocaleString('en-IN')}</td>
            <td>${t.percentage_of_budget}%</td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <h3>Vendor Strategy &amp; Platforms</h3>
      ${result.budget_breakdown
        .map(
          c => `
        <h4>${c.category} - ₹${c.allocation.toLocaleString('en-IN')} (₹${c.cost_per_head_share || 0}/head)</h4>
        <ul>
          ${c.items.map(it => `<li><strong>${it.name}</strong> - ₹${it.estimated_price.toLocaleString('en-IN')}: ${it.description}</li>`).join('')}
        </ul>
      `
        )
        .join('')}
      <h3>Cost-Saving Event Hacks</h3>
      <ul>
        ${result.cost_saving_tips.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    `;
    printBudgetSummary(`${partyType} Plan`, content);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-950/40 to-slate-900 p-6 rounded-2xl border border-emerald-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <PartyPopper className="w-3.5 h-3.5" /> Scenario 2: AI Party Budget Planning
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Event &amp; Party Budget Allocator
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Calculate cost-per-head instantly. Gemini distributes funds across catering, venue, decor, and entertainment with real search integrations for Swiggy, Zomato, OYO, and Amazon.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
            {PARTY_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadPreset(p)}
                className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" /> Event Parameters
            </h2>
            <div className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              ₹{costPerHeadPreview}/head
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Total Budget */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Total Event Budget ({currency}):
                </label>
                <span className="text-sm font-bold text-emerald-400">
                  {formatINR(budget, currency, exchangeRate)}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="2500"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center gap-1.5 mt-2">
                {[15000, 30000, 60000, 100000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setBudget(amt)}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                      budget === amt
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    ₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Event Type & Guest Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Occasion Type
                </label>
                <select
                  value={partyType}
                  onChange={e => setPartyType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Wedding Reception">Wedding Reception</option>
                  <option value="Anniversary Celebration">Anniversary</option>
                  <option value="Corporate Meet">Corporate Meet</option>
                  <option value="College Farewell">College Farewell</option>
                  <option value="Housewarming (Gruhapravesam)">Housewarming</option>
                  <option value="Festival Feast">Festival Feast</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Guest Count
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={numGuests}
                    onChange={e => setNumGuests(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Venue Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Preferred Venue Setting
              </label>
              <select
                value={venueType}
                onChange={e => setVenueType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Rented Banquet Hall">Rented Banquet Hall</option>
                <option value="OYO Rooms / Hotel Banquet Suite">OYO Rooms / Hotel Banquet Suite</option>
                <option value="Rooftop Cafe or Lounge">Rooftop Cafe or Lounge</option>
                <option value="Home / Terrace / Lawn">Home / Terrace / Lawn (Free Venue)</option>
                <option value="Community Center / Temple Hall">Community Center / Temple Hall</option>
                <option value="Resort Day Space">Resort Day Space</option>
              </select>
            </div>

            {/* Inclusions */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 block">
                Required Expense Categories:
              </span>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                  <input
                    type="checkbox"
                    checked={needsCatering}
                    onChange={e => setNeedsCatering(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-slate-300 text-[11px] font-medium">Food &amp; Cake</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                  <input
                    type="checkbox"
                    checked={needsDecoration}
                    onChange={e => setNeedsDecoration(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-slate-300 text-[11px] font-medium">Theme Decor</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                  <input
                    type="checkbox"
                    checked={needsEntertainment}
                    onChange={e => setNeedsEntertainment(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-slate-300 text-[11px] font-medium">DJ / Games</span>
                </label>
              </div>
            </div>

            {/* Additional constraints */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Menu or Party Preferences (Optional):
              </label>
              <textarea
                value={additionalReqs}
                onChange={e => setAdditionalReqs(e.target.value)}
                placeholder="e.g. Pure vegetarian buffet, chocolate truffle cake, LED selfie backdrop, return gift pouches for kids..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini Computing Party Budget...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Party Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && (
            <div className="bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <PartyPopper className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">No Event Plan Generated Yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your total budget and estimated guest count, then click{' '}
                  <strong className="text-emerald-400">"Generate AI Party Plan"</strong> to get per-head calculations and vendor recommendations.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Gemini 3.8 Flash Allocating Event Funds</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Checking Swiggy/Zomato bulk meal pricing &amp; OYO banquet options for {numGuests} guests...
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Smart Alert Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 shadow-lg ${
                  result.is_budget_tight
                    ? 'bg-amber-950/60 border-amber-800/80 text-amber-200'
                    : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
                }`}
              >
                {result.is_budget_tight ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {result.is_budget_tight ? 'Smart Alert: Budget Optimization Advice' : 'Budget Feasibility Confirmed'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-95">{result.smart_alert}</p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      {partyType} Budget Breakdown
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tailored for {result.guest_count} guests • {venueType}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={shareWhatsApp}
                      className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Share Party Breakdown to WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Print or Export as PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Print / PDF</span>
                    </button>
                  </div>
                </div>

                {/* 3 Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Budget</span>
                    <span className="text-base font-extrabold text-white">
                      {formatINR(result.total_budget, currency, exchangeRate)}
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Guest Count</span>
                    <span className="text-base font-extrabold text-emerald-400">{result.guest_count}</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Cost Per Head</span>
                    <span className="text-base font-extrabold text-amber-400">
                      {formatINR(result.cost_per_head, currency, exchangeRate)}
                    </span>
                  </div>
                </div>

                {/* Donut Chart */}
                <BudgetPieChart
                  data={result.budget_breakdown.map(cat => ({
                    label: cat.category,
                    value: cat.allocation,
                  }))}
                  total={result.total_budget}
                  currency={currency}
                  exchangeRate={exchangeRate}
                  centerTitle="Party Fund Split"
                />
              </div>

              {/* Calculation Table */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  Category Allocations &amp; Per-Head Share
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Expense Category</th>
                        <th className="py-2.5 px-3 text-center">Items</th>
                        <th className="py-2.5 px-3 text-right">Cost ({currency})</th>
                        <th className="py-2.5 px-3 text-right">Budget Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {result.calculation_table.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-medium text-white">{row.category}</td>
                          <td className="py-2.5 px-3 text-center text-slate-300">{row.items_count}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-200">
                            {formatINR(row.total_cost, currency, exchangeRate)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                            {row.percentage_of_budget}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommended Items by Category with Shopping Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-400" /> Sourced Vendors &amp; Platform Recommendations
                </h3>

                {result.budget_breakdown.map((cat, idx) => (
                  <div key={idx} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="font-bold text-sm text-teal-300">{cat.category}</span>
                        {cat.cost_per_head_share ? (
                          <span className="text-[11px] text-slate-400 ml-2">
                            (₹{cat.cost_per_head_share}/guest)
                          </span>
                        ) : null}
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {formatINR(cat.allocation, currency, exchangeRate)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cat.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-xs text-white leading-snug">
                                {item.name}
                              </h4>
                              <span className="text-xs font-bold text-amber-400 shrink-0">
                                {formatINR(item.estimated_price, currency, exchangeRate)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="pt-1 border-t border-slate-900">
                            <ShoppingLinksBadges links={item.shopping_links} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Venue Suggestions Card */}
              {result.venue_suggestions && result.venue_suggestions.length > 0 && (
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
                  <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Hotel className="w-4 h-4 text-rose-400" />
                    Venue Booking Suggestions (OYO &amp; Banquets)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.venue_suggestions.map((v, i) => (
                      <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{v.name}</span>
                          <span className="text-xs font-semibold text-rose-400">
                            {formatINR(v.estimated_cost, currency, exchangeRate)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Capacity: {v.capacity} guests • Search on OYO, MakeMyTrip, or Google
                        </p>
                        <ShoppingLinksBadges links={v.search_links} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Saving Tips */}
              <div className="bg-teal-950/40 rounded-2xl border border-teal-800/40 p-4 space-y-2">
                <h4 className="text-xs font-bold text-teal-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4 text-teal-400" />
                  Event Cost-Saving Hacks
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.cost_saving_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-400 font-bold shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
