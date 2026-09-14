import React, { useState } from 'react';
import { KeyRound, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [adminSecret, setAdminSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Validate secret against admin results endpoint
      const res = await axios.get('/admin/results', {
        headers: { 'x-admin-secret': adminSecret.trim() },
      });

      if (res.data && res.data.success) {
        onLoginSuccess(adminSecret.trim());
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setErrorMsg('Invalid Admin Secret Key. Access denied.');
      } else {
        setErrorMsg('Connection error. Verify backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-6 h-6 text-purple-400" />
        </div>

        <h3 className="font-heading text-2xl font-bold text-white text-center mb-1">
          Admin Portal Authentication
        </h3>
        <p className="text-xs text-slate-400 text-center mb-6">
          Enter the society admin secret key from <code className="text-cyan-300">backend/.env</code> to unlock management controls.
        </p>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Admin Secret Key
            </label>
            <input
              type="password"
              required
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 font-mono"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition cursor-pointer"
            >
              Back to Quiz
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-heading font-semibold text-xs text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-300 hover:from-purple-300 hover:to-indigo-200 shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Unlock Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
