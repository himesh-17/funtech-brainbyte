import React from 'react';
import { Shield, Eye, Copy, Lock, Maximize2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RulesModal({ participant, onAcceptRules, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-slate-100">
              Exam Security & Integrity Protocol
            </h3>
            <p className="text-xs text-slate-400">
              Participant: <span className="text-cyan-300 font-semibold">{participant?.name}</span> ({participant?.email})
            </p>
          </div>
        </div>

        {/* Rules Content */}
        <div className="space-y-4 overflow-y-auto pr-2 text-sm text-slate-300">
          
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-start space-x-3 text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-amber-300">Strict Anti-Cheating Monitoring Enabled</h4>
                <p className="text-xs text-slate-300 mt-1">
                  This portal uses continuous tab-switch monitoring and window blur detection. Any unauthorized action will be logged instantly.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <Eye className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200 text-xs">1. Tab Switching & Window Focus</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  You are allowed a maximum of <strong className="text-cyan-300">3 tab switches / window defocuses</strong>. On the 3rd violation, your test will be immediately locked & auto-submitted.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <Copy className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200 text-xs">2. Copy, Paste & Context Menu Disabled</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Text selection, right-clicking, developer options (F12), and keyboard shortcuts (<code className="text-indigo-300">Ctrl+C</code>, <code className="text-indigo-300">Ctrl+V</code>) are completely disabled.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200 text-xs">3. Screenshot & Screen Recording Protection</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pressing <code className="text-purple-300">PrintScreen</code> or attempting a screenshot triggers a temporary security blackout shield.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <Maximize2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200 text-xs">4. Fullscreen Mode Required</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clicking "I Agree & Launch Fullscreen Quiz" will switch your browser into Fullscreen mode for the entire duration of the assessment.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition cursor-pointer"
          >
            Cancel Session
          </button>
          
          <button
            onClick={onAcceptRules}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-heading font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>I Agree & Launch Fullscreen Quiz</span>
          </button>
        </div>

      </div>
    </div>
  );
}
