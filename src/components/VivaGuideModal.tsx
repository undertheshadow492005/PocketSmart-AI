import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Award,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Code2,
  Share2,
} from 'lucide-react';

interface VivaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaGuideModal: React.FC<VivaGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'viva' | 'routes'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  PocketSmartAI Project &amp; Viva Guide
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  Naan Mudhalvan
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Evaluation Blueprint, System Architecture, &amp; Technical Viva Defense
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 text-xs px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Abstract &amp; Problem</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>System Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'routes'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>API Route Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'viva'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Viva Voce Q&amp;A</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Project Title &amp; Abstract
                </h3>
                <p className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="text-white">PocketSmartAI:</strong> An intelligent financial budgeting and recommendation web application built for the <em>Naan Mudhalvan</em> skill development initiative. It eliminates financial guesswork across three essential consumer domains: <strong>Home Interior Planning</strong>, <strong>Party &amp; Event Budgeting</strong>, and <strong>Occasion Jewelry Styling</strong> with multimodal outfit vision analysis.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  The Three Core Scenarios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-blue-900/50">
                    <span className="font-bold text-blue-400 text-xs block mb-1">Scenario 1: Home Interior</span>
                    <p className="text-xs text-slate-300">
                      Smart allocation across Lighting, BLDC Fans, Furniture, and Soft Furnishings with dynamic links to IKEA, Amazon India, and Flipkart.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-900/50">
                    <span className="font-bold text-emerald-400 text-xs block mb-1">Scenario 2: Party Planner</span>
                    <p className="text-xs text-slate-300">
                      Calculates exact Cost Per Head (₹/guest), alerts users if budgets are tight, and links to Swiggy/Zomato party trays and OYO banquets.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-purple-900/50">
                    <span className="font-bold text-purple-400 text-xs block mb-1">Scenario 3: Jewelry Vision</span>
                    <p className="text-xs text-slate-300">
                      Accepts an outfit image upload, uses Gemini Vision to detect neckline cut &amp; color, computes purchasable gold grams, and links to Tanishq &amp; Caratlane.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Key Evaluator Highlights
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>No 404 Hallucinations:</strong> Instead of asking Gemini for fragile static URLs, the system generates search queries and programmatically constructs live e-commerce search links via safe URL encoding.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>True Multimodality:</strong> In Scenario 3, image data is ingested by Google Gemini to analyze dress aesthetics, necklines, and embroidery accents.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Indian Market Localization:</strong> Calculations in Indian Rupees (₹), BIS Hallmarking checks (916 / HUID), and gold rate estimation per gram.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Full-Stack Architecture
                </h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
                  <div>[Client: React 19 + Tailwind v4 + Lucide + Motion]</div>
                  <div className="pl-4 text-slate-500">↓ (Fetch JSON / REST API with Bearer token)</div>
                  <div>[Backend: Express.js + Node / FastAPI Design Standards]</div>
                  <div className="pl-4 text-slate-500">↓ (Telemetry User-Agent: 'aistudio-build')</div>
                  <div>[AI Brain: Google Gemini 3.8 Flash SDK (@google/genai)]</div>
                  <div className="pl-4 text-slate-500">↓ (Clean JSON Parsing + Dynamic URL Builders)</div>
                  <div>[Output: Interactive Donut Charts, Calculation Tables &amp; Store Links]</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-white text-xs block mb-1">Frontend Layer</span>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• React 19 Single Page App with Vite</li>
                    <li>• Tailwind CSS v4 styling</li>
                    <li>• Custom interactive SVG Donut Pie Charts</li>
                    <li>• Live camera capture &amp; outfit drag-and-drop</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-white text-xs block mb-1">Security &amp; Persistence</span>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Session tracking with token blacklisting</li>
                    <li>• Protected history query endpoints</li>
                    <li>• Safe URL encoding prevents XSS</li>
                    <li>• Server-side API key protection</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                PocketSmartAI Endpoint Mapping
              </h3>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-300">POST</span>
                  <div>
                    <span className="font-mono text-white font-bold">/api/generate-home</span>
                    <p className="text-slate-400 mt-0.5">
                      Processes budget, room type, fixture counts (fans, lights, furniture, dining). Returns category allocation, calculation table, and IKEA/Amazon links.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300">POST</span>
                  <div>
                    <span className="font-mono text-white font-bold">/api/generate-party</span>
                    <p className="text-slate-400 mt-0.5">
                      Processes guest count, event type, and budget. Calculates cost-per-head, checks budget feasibility, and formats Swiggy, Zomato, and OYO venue links.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-purple-500/20 text-purple-300">POST</span>
                  <div>
                    <span className="font-mono text-white font-bold">/api/generate-jewelry</span>
                    <p className="text-slate-400 mt-0.5">
                      Accepts text parameters + optional base64 outfit photo. Performs multimodal vision analysis to pair jewelry with neckline cut and links to Tanishq &amp; Caratlane.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300">GET</span>
                  <div>
                    <span className="font-mono text-white font-bold">/api/gold-rates</span>
                    <p className="text-slate-400 mt-0.5">
                      Returns live bullion benchmarks for 24K, 22K (916), 18K Gold and Silver, with USD-to-INR conversion formula.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-700 text-slate-200">AUTH</span>
                  <div>
                    <span className="font-mono text-white font-bold">/api/register, /api/login, /api/logout, /api/session-info</span>
                    <p className="text-slate-400 mt-0.5">
                      Manages session tokens, active login states, and token invalidation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Frequently Asked Viva Questions &amp; Answers
              </h3>

              <div className="space-y-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs block">
                    Q1: How does your application prevent AI link hallucinations (404 errors)?
                  </span>
                  <p className="text-xs text-slate-300">
                    <strong>Answer:</strong> Large language models frequently hallucinate static product URLs. In PocketSmartAI, we instruct Gemini to output structured <code>search_terms</code> (e.g., <em>"Orient Electric 1200mm BLDC ceiling fan"</em>). Our backend then dynamically constructs search URLs using safe URL encoding (e.g. <code>https://www.amazon.in/s?k=...</code>), guaranteeing 100% active, relevant search pages without broken links.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs block">
                    Q2: How does the multimodal vision pipeline work in Scenario 3?
                  </span>
                  <p className="text-xs text-slate-300">
                    <strong>Answer:</strong> When the user uploads an outfit photo, the client converts it into an image payload. The backend attaches this as an <code>inlineData</code> part alongside the prompt to Google Gemini 3.8 Flash. The vision model analyzes the garment's neckline (V-neck, boat neck, collar), color palette, and embroidery, then outputs jewelry pieces that match the neckline symmetry.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs block">
                    Q3: Why is Gemini 3.8 Flash preferred over other models for this project?
                  </span>
                  <p className="text-xs text-slate-300">
                    <strong>Answer:</strong> Gemini 3.8 Flash offers sub-second latency, multimodal vision capabilities, and native JSON schema enforcement via <code>responseMimeType: "application/json"</code>. This ensures zero parsing failures when rendering frontend pie charts and calculation tables.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs block">
                    Q4: How do you calculate gold weight feasibility in the Jewelry Planner?
                  </span>
                  <p className="text-xs text-slate-300">
                    <strong>Answer:</strong> We benchmark 22K gold rate (₹6,890/g) and factor in standard Indian market overheads (12% average making charges + 3% statutory GST, i.e., effective multiplier of 1.15). The attainable metal weight is calculated as <code>Budget / (Rate * 1.15)</code>, preventing users from expecting unattainable gold volumes within limited budgets.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            PocketSmartAI • Tamil Nadu Naan Mudhalvan Skill Initiative
          </span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
