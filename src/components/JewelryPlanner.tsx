import React, { useState, useRef } from 'react';
import { JewelryBudgetResponse, GoldRatesResponse } from '../types';
import { ShoppingLinksBadges } from './ShoppingLinksBadges';
import { formatINR, generateWhatsAppLink, printBudgetSummary } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Gem,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Calculator,
  Share2,
  Printer,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  X,
  Camera,
  Coins,
  Palette,
} from 'lucide-react';

interface JewelryPlannerProps {
  ratesData: GoldRatesResponse | null;
  currency: 'INR' | 'USD';
  exchangeRate?: number;
}

// 4 realistic base64 sample outfits with distinct necklines and colors for instant multimodal testing
const SAMPLE_OUTFITS = [
  {
    name: 'Emerald Green Kanjeevaram Saree',
    neckline: 'Wide Boat Neck / Zari Pallu',
    color: 'Deep Emerald & Gold',
    // Lightweight SVG data URI representing traditional silk saree with gold zari
    dataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23064e3b"/><path d="M 0 0 L 150 150 L 300 0 Z" fill="%23047857"/><path d="M 60 0 C 100 80, 200 80, 240 0 Z" fill="%23fbbf24"/><rect x="0" y="240" width="300" height="60" fill="%23d97706"/><line x1="0" y1="240" x2="300" y2="240" stroke="%23fef3c7" stroke-width="6"/><text x="150" y="275" font-family="sans-serif" font-size="16" fill="%23ffffff" text-anchor="middle" font-weight="bold">Kanjeevaram Silk %26 Zari</text></svg>',
  },
  {
    name: 'Maroon Velvet V-Neck Lehenga',
    neckline: 'Deep V-Neck Cut',
    color: 'Royal Maroon & Antique Gold',
    dataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23831843"/><polygon points="150,220 90,0 210,0" fill="%23fbcfe8"/><polygon points="150,190 110,0 190,0" fill="%23f59e0b"/><rect x="0" y="250" width="300" height="50" fill="%23500724"/><text x="150" y="280" font-family="sans-serif" font-size="16" fill="%23fef08a" text-anchor="middle" font-weight="bold">Bridal V-Neck Lehenga</text></svg>',
  },
  {
    name: 'Pastel Blush Embroidered Anarkali',
    neckline: 'Sweetheart Neckline with Pearls',
    color: 'Blush Pink & Silver Thread',
    dataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23fdf2f8"/><circle cx="150" cy="120" r="100" fill="%23fbcfe8"/><path d="M 100 20 C 130 90, 170 90, 200 20 Z" fill="%23f472b6"/><circle cx="150" cy="150" r="10" fill="%23e2e8f0"/><text x="150" y="270" font-family="sans-serif" font-size="15" fill="%239d174d" text-anchor="middle" font-weight="bold">Pastel Anarkali Gown</text></svg>',
  },
  {
    name: 'Royal Blue Silk Indo-Western Kurti',
    neckline: 'Mandarin Collar / High Neck',
    color: 'Cobalt Royal Blue',
    dataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231e3a8a"/><rect x="120" y="0" width="60" height="70" fill="%231d4ed8"/><rect x="135" y="70" width="30" height="150" fill="%23fbbf24"/><circle cx="150" cy="95" r="5" fill="%23ffffff"/><circle cx="150" cy="125" r="5" fill="%23ffffff"/><text x="150" y="275" font-family="sans-serif" font-size="15" fill="%23e0f2fe" text-anchor="middle" font-weight="bold">Royal Blue Collar Kurti</text></svg>',
  },
];

export const JewelryPlanner: React.FC<JewelryPlannerProps> = ({
  ratesData,
  currency,
  exchangeRate = 86.5,
}) => {
  // Form State
  const [budget, setBudget] = useState<number>(45000);
  const [occasion, setOccasion] = useState<string>('Wedding Guest');
  const [materialPreference, setMaterialPreference] = useState<string>('Gold 22K (916)');
  const [stylePreference, setStylePreference] = useState<string>('Traditional Antique Temple');
  const [outfitImage, setOutfitImage] = useState<string>('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Results State
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<JewelryBudgetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute live approximate metal weight
  const gold22kRate = ratesData?.rates.gold_22k_per_gram || 6890;
  const gold18kRate = ratesData?.rates.gold_18k_per_gram || 5640;
  const silverRate = ratesData?.rates.silver_per_gram || 94;

  let baseRate = gold22kRate;
  if (materialPreference.includes('18K')) baseRate = gold18kRate;
  else if (materialPreference.toLowerCase().includes('silver')) baseRate = silverRate;

  // Approximate purchasable metal weight accounting for 12% making charges & 3% GST
  const estimatedMetalGrams = (budget / (baseRate * 1.15)).toFixed(1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError('Please choose an image under 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOutfitImage(reader.result as string);
        setSelectedSampleIndex(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSampleOutfit = (index: number) => {
    setSelectedSampleIndex(index);
    setOutfitImage(SAMPLE_OUTFITS[index].dataUri);
  };

  const handleRemoveImage = () => {
    setOutfitImage('');
    setSelectedSampleIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-jewelry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          occasion,
          material_preference: materialPreference,
          style_preference: stylePreference,
          outfit_image: outfitImage,
          additional_notes: additionalNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate jewelry recommendations');
      }

      const data: JewelryBudgetResponse = await response.json();
      setResult(data);
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while connecting to Gemini Vision AI');
    } finally {
      setLoading(false);
    }
  };

  const shareWhatsApp = () => {
    if (!result) return;
    const text = `💎 *PocketSmartAI - Jewelry Recommendation*
*Occasion:* ${occasion} (${materialPreference})
*Total Budget:* ₹${result.total_budget.toLocaleString('en-IN')}

*AI Style Recommendation:* ${result.style_recommendation}

*Curated Pieces:*
${result.recommendations.map(r => `• ${r.piece_name} (~₹${r.estimated_price.toLocaleString('en-IN')}) - ${r.approx_weight_or_carat}`).join('\n')}

*BIS Hallmarking Tip:* ${result.metal_care_and_hallmarking_tips[0] || 'Verify 916 mark & HUID.'}
Generated with PocketSmartAI • Naan Mudhalvan Project`;
    window.open(generateWhatsAppLink(text), '_blank');
  };

  const handlePrint = () => {
    if (!result) return;
    const content = `
      <h2>Jewelry Styling Report - ${occasion}</h2>
      <p><strong>Total Budget:</strong> ₹${result.total_budget.toLocaleString('en-IN')} | <strong>Material:</strong> ${materialPreference} | <strong>Style:</strong> ${stylePreference}</p>
      <p style="background: #fdf2f8; color: #831843; padding: 10px; border-radius: 6px;"><strong>Outfit &amp; Neckline Analysis:</strong> ${result.outfit_analysis}</p>
      <p><em>${result.style_recommendation}</em></p>
      <h3>Curated Pieces &amp; Hallmarking Estimates</h3>
      <table>
        <thead>
          <tr>
            <th>Piece Name</th>
            <th>Category</th>
            <th>Est. Weight / Carats</th>
            <th>Price (₹)</th>
            <th>Styling Match</th>
          </tr>
        </thead>
        <tbody>
          ${result.recommendations
            .map(
              r => `<tr>
            <td><strong>${r.piece_name}</strong></td>
            <td>${r.category}</td>
            <td>${r.approx_weight_or_carat}</td>
            <td>₹${r.estimated_price.toLocaleString('en-IN')}</td>
            <td>${r.matching_reason}</td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <h3>BIS Hallmarking &amp; Care Advice</h3>
      <ul>
        ${result.metal_care_and_hallmarking_tips.map(t => `<li>${t}</li>`).join('')}
      </ul>
    `;
    printBudgetSummary(`${occasion} Jewelry Recommendations`, content);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-fuchsia-950/40 to-slate-900 p-6 rounded-2xl border border-purple-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
              <Gem className="w-3.5 h-3.5" /> Scenario 3: Jewelry Recommendations (Multimodal Vision)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Occasion Jewelry Stylist &amp; Vision Matcher
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Upload your outfit photo or pick a sample dress. Gemini Vision analyzes neckline, color palette, and zari work to recommend BIS-hallmarked jewelry from Tanishq, Caratlane, and Bluestone.
            </p>
          </div>

          {/* Metal Rate Benchmark Pill */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 text-xs shrink-0 shadow-lg">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
              <Coins className="w-4 h-4" /> Live Bullion Benchmark
            </div>
            <div className="text-slate-300 space-y-0.5">
              <div>22K (916): <span className="font-bold text-white">₹{gold22kRate.toLocaleString('en-IN')}/g</span></div>
              <div>Silver: <span className="font-bold text-white">₹{silverRate}/g</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" /> Styling &amp; Vision Inputs
            </h2>
            <div className="text-xs bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/20">
              ~{estimatedMetalGrams}g Metal Cap
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Total Budget */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Jewelry Budget ({currency}):
                </label>
                <span className="text-sm font-bold text-amber-400">
                  {formatINR(budget, currency, exchangeRate)}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="250000"
                step="2500"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center gap-1.5 mt-2">
                {[15000, 35000, 50000, 100000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setBudget(amt)}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                      budget === amt
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    ₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion & Material */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Wedding / Bridal">Wedding / Bridal</option>
                  <option value="Wedding Guest">Wedding Guest</option>
                  <option value="Festive (Diwali / Pongal)">Festive (Diwali / Pongal)</option>
                  <option value="Engagement Ceremony">Engagement Ceremony</option>
                  <option value="Daily Wear / Office">Daily Wear / Office</option>
                  <option value="Anniversary Gifting">Anniversary Gifting</option>
                  <option value="Cocktail / Sangeet Party">Cocktail / Sangeet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Precious Metal
                </label>
                <select
                  value={materialPreference}
                  onChange={e => setMaterialPreference(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Gold 22K (916)">Gold 22K (916 Hallmark)</option>
                  <option value="Gold 18K (Diamond Grade)">Gold 18K (Diamond Grade)</option>
                  <option value="925 Sterling Silver">925 Sterling Silver</option>
                  <option value="Platinum (950)">Platinum (950 Pure)</option>
                  <option value="Fashion / Kundan & Polki">Fashion / Kundan &amp; Polki</option>
                </select>
              </div>
            </div>

            {/* Style Aesthetic */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Design &amp; Craftsmanship Style
              </label>
              <select
                value={stylePreference}
                onChange={e => setStylePreference(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Traditional Antique Temple">Traditional Antique Temple (Matte Gold)</option>
                <option value="Modern Minimalist & Sleek">Modern Minimalist &amp; Sleek</option>
                <option value="Royal Kundan & Meenakari">Royal Kundan &amp; Meenakari</option>
                <option value="Indo-Western Fusion">Indo-Western Fusion</option>
                <option value="Solitaire & Diamond Sparkle">Solitaire &amp; Diamond Sparkle</option>
                <option value="South Indian Heritage (Lakshmi/Mango)">South Indian Heritage</option>
              </select>
            </div>

            {/* Outfit Image Upload / Sample Picker (MULTIMODAL) */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-purple-400" />
                  Outfit Photo (Multimodal Vision)
                </span>
                <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded">
                  Optional
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Upload your dress photo or choose a preset sample. Gemini Vision will analyze neckline cut, zari border, and colors to match jewelry.
              </p>

              {/* Sample Outfits Grid */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Or Test with Sample Outfits:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_OUTFITS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectSampleOutfit(idx)}
                      className={`p-2 rounded-lg text-left border transition-all text-xs flex items-center gap-2 ${
                        selectedSampleIndex === idx
                          ? 'bg-purple-950/80 border-purple-500 text-white shadow-sm shadow-purple-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-7 h-7 rounded border border-slate-700 overflow-hidden shrink-0">
                        <img src={sample.dataUri} alt={sample.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <span className="font-semibold block truncate text-[11px]">{sample.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{sample.neckline}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* File upload input or preview */}
              {outfitImage ? (
                <div className="relative rounded-xl border border-purple-500/40 overflow-hidden bg-slate-900 p-2 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                    <img src={outfitImage} alt="Outfit preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-white block">
                      {selectedSampleIndex !== null
                        ? SAMPLE_OUTFITS[selectedSampleIndex].name
                        : 'Uploaded Outfit Image'}
                    </span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3" /> Ready for Gemini Multimodal Analysis
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-900/40"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-xs font-semibold text-slate-300 block">
                    Upload Outfit Image from device
                  </span>
                  <span className="text-[10px] text-slate-500">PNG, JPG, or WEBP (Max 8MB)</span>
                </div>
              )}
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Special Styling Notes (Optional):
              </label>
              <textarea
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Sensitive to heavy earrings, prefer chokers over long haar, want lightweight wearable everyday gold..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini Vision Analyzing Outfit &amp; Matching Pieces...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Recommend Matching Jewelry</span>
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
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Gem className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">No Jewelry Recommendations Yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose your budget and select or upload an outfit photo, then click{' '}
                  <strong className="text-purple-400">"Recommend Matching Jewelry"</strong> to receive vision-matched Indian jewelry options.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Gemini 3.8 Flash Vision Processing</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inspecting neckline coordinates, color balance, and querying Tanishq, Caratlane &amp; Bluestone collections...
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
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      {occasion} Jewelry Suite
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">{result.style_recommendation}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={shareWhatsApp}
                      className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Share Jewelry Recommendations to WhatsApp"
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

                {/* Bullion & Weight Benchmark Card */}
                <div className="bg-gradient-to-r from-amber-950/50 to-slate-950 p-4 rounded-xl border border-amber-600/30 flex items-start gap-3">
                  <Coins className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-amber-200 uppercase tracking-wide text-[11px] block">
                      Metal Calculation Benchmark
                    </span>
                    <p className="text-slate-200 leading-relaxed">{result.metal_benchmark_info}</p>
                  </div>
                </div>

                {/* Multimodal Outfit Vision Analysis */}
                <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-800/40 flex items-start gap-3">
                  <Palette className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-purple-200 uppercase tracking-wide text-[11px] block">
                      AI Outfit &amp; Neckline Assessment
                    </span>
                    <p className="text-slate-300 leading-relaxed">{result.outfit_analysis}</p>
                  </div>
                </div>
              </div>

              {/* Recommended Jewelry Items */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Gem className="w-4 h-4 text-purple-400" /> Curated Jewelry Pieces &amp; Verified Retailers
                </h3>

                <div className="space-y-3">
                  {result.recommendations.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-colors space-y-3 shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                              {item.category}
                            </span>
                            <h4 className="font-bold text-sm text-white">{item.piece_name}</h4>
                          </div>
                          <span className="text-xs text-amber-400 font-medium block mt-0.5">
                            {item.approx_weight_or_carat}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-extrabold text-amber-300 block">
                            {formatINR(item.estimated_price, currency, exchangeRate)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-slate-400">Styling Rationale:</strong> {item.matching_reason}
                      </p>

                      <div className="pt-1">
                        <ShoppingLinksBadges links={item.shopping_links} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hallmarking & Care Checklist */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  BIS Hallmarking Standard &amp; Metal Care Guide
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                  {result.metal_care_and_hallmarking_tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
