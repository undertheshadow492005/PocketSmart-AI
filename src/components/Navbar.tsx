import React from 'react';
import { ScenarioType, UserProfile } from '../types';
import {
  Home,
  PartyPopper,
  Gem,
  History,
  BookOpen,
  User,
  LogOut,
  IndianRupee,
  DollarSign,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
  currency: 'INR' | 'USD';
  onToggleCurrency: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenViva: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScenario,
  onSelectScenario,
  currency,
  onToggleCurrency,
  user,
  onOpenAuth,
  onLogout,
  onOpenViva,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => onSelectScenario('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                    PocketSmart<span className="text-indigo-400">AI</span>
                  </span>
                  <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">
                    Naan Mudhalvan
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Smart Budget &amp; Recommendation Engine
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 text-xs">
            <button
              onClick={() => onSelectScenario('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentScenario === 'home'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home Interior</span>
            </button>

            <button
              onClick={() => onSelectScenario('party')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentScenario === 'party'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PartyPopper className="w-4 h-4" />
              <span>Party Planner</span>
            </button>

            <button
              onClick={() => onSelectScenario('jewelry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentScenario === 'jewelry'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Gem className="w-4 h-4" />
              <span>Jewelry &amp; Vision</span>
            </button>

            <button
              onClick={() => onSelectScenario('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentScenario === 'history'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Past Plans</span>
            </button>
          </nav>

          {/* Right Tools: Currency Toggle, Viva Guide, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency toggle */}
            <button
              onClick={onToggleCurrency}
              title="Toggle INR (₹) / USD ($) Currency View"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {currency === 'INR' ? (
                <>
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>INR (₹)</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                  <span>USD ($)</span>
                </>
              )}
            </button>

            {/* Viva & Architecture Guide */}
            <button
              onClick={onOpenViva}
              title="View Naan Mudhalvan Architecture & Viva Cheat-Sheet"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-xs font-medium text-indigo-200 hover:bg-indigo-900 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Project Guide</span>
            </button>

            {/* User Auth */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/90 rounded-lg border border-slate-700 text-xs">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-slate-200 max-w-[100px] truncate">
                    {user.fullName || user.username}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout Session"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-300 border border-slate-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile scenario bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => onSelectScenario('home')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
              currentScenario === 'home' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px]">Home</span>
          </button>
          <button
            onClick={() => onSelectScenario('party')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
              currentScenario === 'party' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <PartyPopper className="w-4 h-4" />
            <span className="text-[10px]">Party</span>
          </button>
          <button
            onClick={() => onSelectScenario('jewelry')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
              currentScenario === 'jewelry' ? 'text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Gem className="w-4 h-4" />
            <span className="text-[10px]">Jewelry</span>
          </button>
          <button
            onClick={() => onSelectScenario('history')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
              currentScenario === 'history' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="text-[10px]">Plans</span>
          </button>
        </div>
      </div>
    </header>
  );
};
