import React, { useState } from 'react';
import { HomeBudgetResponse } from '../types';
import { BudgetPieChart } from './BudgetPieChart';
import { ShoppingLinksBadges } from './ShoppingLinksBadges';
import { formatINR, generateWhatsAppLink, printBudgetSummary } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Home,
  Lamp,
  Fan,
  Armchair,
  UtensilsCrossed,
  Sparkles,
  Calculator,
  Share2,
  Printer,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface HomePlannerProps {
  currency: 'INR' | 'USD';
  exchangeRate?: number;
}

const PRESETS = [
  {
    label: 'Compact 1BHK Living (₹50k)',
    budget: 50000,
    room: 'Living Room',
    lights: 4,
    fans: 2,
    furniture: 1,
    dining: 0,
    living: true,
    kitchen: false,
    bedroom: false,
    style: 'Modern Minimalist',
    notes: 'Prioritize compact 3-seater sofa, BLDC fans, and ambient warm lighting.',
  },
  {
    label: 'Master Bedroom Comfort (₹85k)',
    budget: 85000,
    room: 'Master Bedroom',
    lights: 6,
    fans: 2,
    furniture: 2,
    dining: 0,
    living: false,
    kitchen: false,
    bedroom: true,
    style: 'Scandinavian Warmth',
    notes: 'King size hydraulic storage bed with bedside warm task pendants.',
  },
  {
    label: 'Modular Kitchen & Dining (₹1.5L)',
    budget: 150000,
    room: 'Kitchen & Dining',
    lights: 8,
    fans: 1,
    furniture: 1,
    dining: 1,
    living: false,
    kitchen: true,
    bedroom: false,
    style: 'Contemporary Chic',
    notes: 'Acrylic finish cabinets, 4-seater wooden dining set, under-cabinet strip LEDs.',
  },
];

export const HomePlanner: React.FC<HomePlannerProps> = ({ currency, exchangeRate = 86.5 }) => {
  // Form State
  const [budget, setBudget] = useState<number>(50000);
  const [roomType, setRoomType] = useState<string>('Living Room');
  const [numLights, setNumLights] = useState<number>(4);
  const [numFans, setNumFans] = useState<number>(2);
  const [numFurniture, setNumFurniture] = useState<number>(1);
  const [numDiningTables, setNumDiningTables] = useState<number>(0);
  const [hasLivingRoom, setHasLivingRoom] = useState<boolean>(true);
  const [hasKitchen, setHasKitchen] = useState<boolean>(false);
  const [hasBedroom, setHasBedroom] = useState<boolean>(false);
  const [stylePreference, setStylePreference] = useState<string>('Modern Minimalist');
  const [additionalReqs, setAdditionalReqs] = useState<string>('');

  // Execution State
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<HomeBudgetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setBudget(preset.budget);
    setRoomType(preset.room);
    setNumLights(preset.lights);
    setNumFans(preset.fans);
    setNumFurniture(preset.furniture);
    setNumDiningTables(preset.dining);
    setHasLivingRoom(preset.living);
    setHasKitchen(preset.kitchen);
    setHasBedroom(preset.bedroom);
    setStylePreference(preset.style);
    setAdditionalReqs(preset.notes);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_budget: budget,
          room_type: roomType,
          num_lights: numLights,
          num_fans: numFans,
          num_furniture: numFurniture,
          num_dining_tables: numDiningTables,
          has_living_room: hasLivingRoom,
          has_kitchen: hasKitchen,
          has_bedroom: hasBedroom,
          style_preference: stylePreference,
          additional_requirements: additionalReqs,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate interior budget plan');
      }

      const data: HomeBudgetResponse = await response.json();
      setResult(data);
      confetti({
        particleCount: 50,
        spread: 60,
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
    const text = `🏠 *PocketSmartAI - Home Interior Budget Plan*
*Room:* ${roomType} (${stylePreference})
*Total Budget:* ₹${result.total_budget.toLocaleString('en-IN')}
*Allocated:* ₹${result.allocated_total.toLocaleString('en-IN')} | *Reserve:* ₹${result.remaining_budget.toLocaleString('en-IN')}

*Category Breakdown:*
${result.budget_breakdown.map(c => `• ${c.category}: ₹${c.allocation.toLocaleString('en-IN')}`).join('\n')}

*Smart Advice:* ${result.smart_recommendations[0] || 'Optimized for Indian homes.'}
Generated with PocketSmartAI • Naan Mudhalvan Project`;
    window.open(generateWhatsAppLink(text), '_blank');
  };

  const handlePrint = () => {
    if (!result) return;
    const content = `
      <h2>${roomType} Interior Plan (${stylePreference})</h2>
      <p><strong>Total Budget:</strong> ₹${result.total_budget.toLocaleString('en-IN')} | <strong>Allocated:</strong> ₹${result.allocated_total.toLocaleString('en-IN')} | <strong>Reserve:</strong> ₹${result.remaining_budget.toLocaleString('en-IN')}</p>
      <p><em>${result.style_summary}</em></p>
      <h3>Budget Allocation by Category</h3>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Item Count</th>
            <th>Estimated Cost (₹)</th>
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
      <h3>Recommended Items &amp; Platforms</h3>
      ${result.budget_breakdown
        .map(
          c => `
        <h4>${c.category} - ₹${c.allocation.toLocaleString('en-IN')}</h4>
        <ul>
          ${c.items.map(it => `<li><strong>${it.name}</strong> (Qty: ${it.quantity}) - ₹${it.estimated_price.toLocaleString('en-IN')}: ${it.description}</li>`).join('')}
        </ul>
      `
        )
        .join('')}
      <h3>Smart Cost-Saving Tips</h3>
      <ul>
        ${result.smart_recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>
      <p><strong>Fallback Strategy:</strong> ${result.fallback_strategy}</p>
    `;
    printBudgetSummary(`${roomType} Interior Plan`, content);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-blue-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
              <Home className="w-3.5 h-3.5" /> Scenario 1: Home Interior Planning
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Smart Home Interior Budget Allocator
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Specify your budget, room details, and fixture quantities. Gemini AI computes an ergonomic budget breakdown, recommends Indian brands, and links directly to IKEA, Amazon, and Flipkart.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
            {PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadPreset(p)}
                className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg transition-colors"
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
              <Calculator className="w-4 h-4 text-blue-400" /> Space &amp; Budget Inputs
            </h2>
            <span className="text-xs text-slate-400">Step 1 of 2</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Total Budget */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Total Interior Budget ({currency}):
                </label>
                <span className="text-sm font-bold text-emerald-400">
                  {formatINR(budget, currency, exchangeRate)}
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="500000"
                step="5000"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center gap-1.5 mt-2">
                {[25000, 50000, 100000, 250000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setBudget(amt)}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                      budget === amt
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    ₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Room Type & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Room Type
                </label>
                <select
                  value={roomType}
                  onChange={e => setRoomType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Living Room">Living Room</option>
                  <option value="Master Bedroom">Master Bedroom</option>
                  <option value="Kids Bedroom">Kids Bedroom</option>
                  <option value="Modular Kitchen">Modular Kitchen</option>
                  <option value="Dining Hall">Dining Hall</option>
                  <option value="Studio 1BHK">Studio 1BHK</option>
                  <option value="Balcony & Veranda">Balcony &amp; Veranda</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Design Aesthetic
                </label>
                <select
                  value={stylePreference}
                  onChange={e => setStylePreference(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Modern Minimalist">Modern Minimalist</option>
                  <option value="Scandinavian Warm">Scandinavian Warm</option>
                  <option value="Contemporary Indian">Contemporary Indian</option>
                  <option value="Traditional Teak / Wooden">Traditional Wooden</option>
                  <option value="Industrial Chic">Industrial Chic</option>
                  <option value="Royal Heritage">Royal Heritage</option>
                </select>
              </div>
            </div>

            {/* Quantity Counters */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                Required Fixtures &amp; Quantities:
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Lights */}
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Lamp className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-300">Lights</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNumLights(Math.max(1, numLights - 1))}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{numLights}</span>
                    <button
                      type="button"
                      onClick={() => setNumLights(numLights + 1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Fans */}
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Fan className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-300">Ceiling Fans</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNumFans(Math.max(0, numFans - 1))}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{numFans}</span>
                    <button
                      type="button"
                      onClick={() => setNumFans(numFans + 1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Main Furniture */}
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-slate-300">Furniture</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNumFurniture(Math.max(0, numFurniture - 1))}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{numFurniture}</span>
                    <button
                      type="button"
                      onClick={() => setNumFurniture(numFurniture + 1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Dining Table */}
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">Dining Sets</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNumDiningTables(Math.max(0, numDiningTables - 1))}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{numDiningTables}</span>
                    <button
                      type="button"
                      onClick={() => setNumDiningTables(numDiningTables + 1)}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Zone Checkboxes */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Connected Living Zones:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/60">
                  <input
                    type="checkbox"
                    checked={hasLivingRoom}
                    onChange={e => setHasLivingRoom(e.target.checked)}
                    className="accent-blue-500 rounded"
                  />
                  <span className="text-slate-300">Living</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/60">
                  <input
                    type="checkbox"
                    checked={hasKitchen}
                    onChange={e => setHasKitchen(e.target.checked)}
                    className="accent-blue-500 rounded"
                  />
                  <span className="text-slate-300">Kitchen</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/60">
                  <input
                    type="checkbox"
                    checked={hasBedroom}
                    onChange={e => setHasBedroom(e.target.checked)}
                    className="accent-blue-500 rounded"
                  />
                  <span className="text-slate-300">Bedroom</span>
                </label>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Special Needs / Constraints (Optional):
              </label>
              <textarea
                value={additionalReqs}
                onChange={e => setAdditionalReqs(e.target.value)}
                placeholder="e.g. Need stain-resistant sofa, BLDC fans with sleep timer, warm 3000K mood lighting, apartment in Chennai..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini AI Allocating Budget...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Smart Home Allocation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && (
            <div className="bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Home className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">No Interior Plan Generated Yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust your budget and fixture quantities on the left, then click{' '}
                  <strong className="text-blue-400">"Generate Smart Home Allocation"</strong> or pick one of the quick presets above.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Gemini 3.8 Flash Computing Recommendations</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluating pricing on IKEA India, Amazon, and Flipkart for {roomType}...
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Summary Card */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      {roomType} Interior Allocation
                    </h2>
                    <p className="text-xs text-slate-400 italic mt-0.5">{result.style_summary}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={shareWhatsApp}
                      className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Share Budget Breakdown to WhatsApp"
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
                    <span className="text-[11px] text-slate-400 block font-medium">Allocated Cost</span>
                    <span className="text-base font-extrabold text-blue-400">
                      {formatINR(result.allocated_total, currency, exchangeRate)}
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Contingency Reserve</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      {formatINR(result.remaining_budget, currency, exchangeRate)}
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
                  centerTitle="Interior Allocation"
                />
              </div>

              {/* Calculation Table */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-400" />
                  Category Breakdown &amp; Percentage Share
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Category</th>
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
                          <td className="py-2.5 px-3 text-right font-bold text-blue-400">
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
                  <Armchair className="w-4 h-4 text-blue-400" /> Recommended Products &amp; Direct Store Links
                </h3>

                {result.budget_breakdown.map((cat, idx) => (
                  <div key={idx} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-sm text-indigo-300">{cat.category}</span>
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

              {/* Smart Recommendations & Fallback Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-950/40 rounded-2xl border border-blue-800/40 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-blue-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <Lightbulb className="w-4 h-4 text-blue-400" />
                    Interior Designer Tips
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.smart_recommendations.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-950/40 rounded-2xl border border-amber-800/40 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    Budget Stretch / Fallback Strategy
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.fallback_strategy}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
