import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, User, Lock, Mail, CheckCircle2, AlertCircle, Sparkles, UserPlus, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  // Default to Sign In as requested in the latest image
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      setLoading(false);
      return;
    }

    const endpoint = isRegister ? '/api/register' : '/api/login';
    const body = isRegister
      ? { username, email, fullName: username, password }
      : { username, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isRegister) {
        // Automatically login after successful registration
        const loginRes = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const loginData = await loginRes.json();
        onLoginSuccess(loginData.user, loginData.token);
        onClose();
      } else {
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setUsername('student');
    setEmail('student@naanmudhalvan.in');
    setPassword('demo123');
    setConfirmPassword('demo123');
    setError(null);
    setInfoMessage(null);
  };

  const handleForgotPassword = () => {
    setInfoMessage('Academic Demo Hint: Use username: student and password: demo123, or register a new account.');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-[420px] my-8">
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center shadow-lg border border-slate-200 transition-transform hover:scale-105"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header above card matching uploaded screenshot */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-[#1e3a8a] tracking-tight">
            PocketSmart
          </h1>
          <p className="text-sm font-semibold text-[#1e3a8a]/80 mt-1">
            AI-Powered Budget Planning
          </p>
        </div>

        {/* White Card matching the user's uploaded screenshot */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-100 text-slate-800 space-y-5">
          {/* Card Title */}
          <h2 className="text-2xl sm:text-[26px] font-black text-center text-[#0f284e] tracking-tight">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>

          {/* Quick Academic Demo Pill */}
          <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <span className="text-blue-900 font-medium">Quick Demo Preset:</span>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="px-2.5 py-1 bg-[#183b63] hover:bg-[#122e4f] text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-amber-300" /> Fill Demo
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                  <User className="w-4 h-4 fill-blue-600/20" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={isRegister ? 'Choose a username' : 'Enter your username'}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Email Field (Only in Register mode) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                    <Mail className="w-4 h-4 fill-blue-600/20" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                  <Lock className="w-4 h-4 fill-blue-600/20" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
                />
              </div>

              {/* Forgot Password link (Right-aligned in Sign In mode matching screenshot) */}
              {!isRegister && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Only in Register mode) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                    <CheckCircle2 className="w-4 h-4 fill-blue-600/20" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Submit Button exactly styled like screenshot */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#183b63] hover:bg-[#122e4f] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-slate-900/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isRegister ? (
                  <>
                    <span>Create Account</span>
                    <UserPlus className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle between Register and Login */}
          <div className="text-center pt-1 text-xs sm:text-sm text-slate-600">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
