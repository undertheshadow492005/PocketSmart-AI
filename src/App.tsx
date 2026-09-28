/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScenarioType, GoldRatesResponse, HistoryItem, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { RatesTicker } from './components/RatesTicker';
import { HomePlanner } from './components/HomePlanner';
import { PartyPlanner } from './components/PartyPlanner';
import { JewelryPlanner } from './components/JewelryPlanner';
import { HistoryView } from './components/HistoryView';
import { VivaGuideModal } from './components/VivaGuideModal';
import { AuthModal } from './components/AuthModal';
import {
  Sparkles,
  Home,
  PartyPopper,
  Gem,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>('home');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [ratesData, setRatesData] = useState<GoldRatesResponse | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isVivaOpen, setIsVivaOpen] = useState<boolean>(false);

  // Load initial gold rates and session info
  useEffect(() => {
    fetch('/api/gold-rates')
      .then(res => res.json())
      .then(data => setRatesData(data))
      .catch(err => console.error('Error fetching bullion rates:', err));

    const savedToken = localStorage.getItem('pocketsmart_token');
    if (savedToken) {
      setToken(savedToken);
      fetch('/api/session-info', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            setUser(data.user);
          } else {
            localStorage.removeItem('pocketsmart_token');
          }
        })
        .catch(err => console.error('Session error:', err));
    }

    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedToken = localStorage.getItem('pocketsmart_token');
    const headers: Record<string, string> = {};
    if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`;

    fetch('/api/history', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.history) setHistory(data.history);
      })
      .catch(err => console.error('History error:', err));
  };

  const handleLoginSuccess = (userProfile: UserProfile, authToken: string) => {
    setUser(userProfile);
    setToken(authToken);
    localStorage.setItem('pocketsmart_token', authToken);
    loadHistory();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setToken('');
    localStorage.removeItem('pocketsmart_token');
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectHistoryPlan = (item: HistoryItem) => {
    setCurrentScenario(item.scenario);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Bullion & Currency Ticker */}
      <RatesTicker ratesData={ratesData} currency={currency} />

      {/* Main Navbar */}
      <Navbar
        currentScenario={currentScenario}
        onSelectScenario={setCurrentScenario}
        currency={currency}
        onToggleCurrency={() => setCurrency(prev => (prev === 'INR' ? 'USD' : 'INR'))}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenViva={() => setIsVivaOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentScenario === 'home' && (
          <HomePlanner currency={currency} exchangeRate={ratesData?.usd_inr_exchange_rate || 86.5} />
        )}

        {currentScenario === 'party' && (
          <PartyPlanner currency={currency} exchangeRate={ratesData?.usd_inr_exchange_rate || 86.5} />
        )}

        {currentScenario === 'jewelry' && (
          <JewelryPlanner
            ratesData={ratesData}
            currency={currency}
            exchangeRate={ratesData?.usd_inr_exchange_rate || 86.5}
          />
        )}

        {currentScenario === 'history' && (
          <HistoryView
            history={history}
            onSelectPlan={handleSelectHistoryPlan}
            onDeletePlan={handleDeletePlan}
            currency={currency}
            exchangeRate={ratesData?.usd_inr_exchange_rate || 86.5}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="font-black text-white text-sm">
                PocketSmart<span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                v2.0
              </span>
              <span className="text-[10px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
                Tamil Nadu Naan Mudhalvan Skill Initiative
              </span>
            </div>
            <p className="text-slate-400 max-w-xl text-[11px]">
              Multi-scenario Smart Budget &amp; Recommendation Engine leveraging Google Gemini 3.8 Flash Multimodal API, dynamic e-commerce linking (Amazon, Flipkart, IKEA, Swiggy, Tanishq), and automated INR cost optimization.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setIsVivaOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Project Architecture &amp; Viva Guide</span>
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">Built with React 19 + Express + Tailwind v4</span>
          </div>
        </div>
      </footer>

      {/* Viva / Architecture Modal */}
      <VivaGuideModal isOpen={isVivaOpen} onClose={() => setIsVivaOpen(false)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
