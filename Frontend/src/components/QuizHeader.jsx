import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, CheckCircle, HelpCircle, Send } from 'lucide-react';

export default function QuizHeader({
  totalQuestions,
  answeredCount,
  timeLimitSeconds,
  tabSwitchCount,
  maxTabSwitches,
  onSubmitClick,
}) {
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds || 1800);

  useEffect(() => {
    if (!timeLimitSeconds) return;
    setTimeLeft(timeLimitSeconds);
  }, [timeLimitSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmitClick();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onSubmitClick]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = timeLeft < 300; // less than 5 mins

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Tab Switch Warning Counter & Security Status */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldAlert className={`w-4 h-4 ${tabSwitchCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-xs text-slate-400 font-medium">Tab Warnings:</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
              tabSwitchCount === 0
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                : tabSwitchCount === 1
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                : 'bg-red-950/80 text-red-400 border border-red-500/30 animate-bounce'
            }`}>
              {tabSwitchCount} / {maxTabSwitches}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Answered: <strong className="text-cyan-200">{answeredCount}</strong> / {totalQuestions}</span>
          </div>
        </div>

        {/* Center: Live Timer Countdown */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2.5 px-4 py-1.5 rounded-xl border font-mono font-bold text-lg transition-all ${
            isTimeCritical
              ? 'bg-red-950/90 border-red-500/50 text-red-400 shadow-lg shadow-red-500/20 animate-pulse'
              : 'bg-slate-950 border-slate-800 text-cyan-400'
          }`}>
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-red-400' : 'text-cyan-400'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Right: Submit Assessment Button */}
        <div className="w-full md:w-auto flex justify-end">
          <button
            onClick={onSubmitClick}
            className="px-5 py-2 rounded-xl font-heading font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-slate-950" />
            <span>Submit Quiz</span>
          </button>
        </div>

      </div>
    </div>
  );
}
