import React, { useEffect } from 'react';
import { Trophy, CheckCircle2, XCircle, Clock, Target, Award, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResultCard({ resultData, participant, onRetakeAttempt }) {
  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (!resultData) return null;

  const { score, maxPossibleScore, totalQuestions, attempted, correct, incorrect, timeTakenSeconds, breakdown } = resultData;
  const percentage = maxPossibleScore ? Math.round((score / maxPossibleScore) * 100) : 0;

  const formatSeconds = (sec) => {
    if (!sec) return 'N/A';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-1">
      <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Badge */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-[1px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-extrabold text-white">Quiz Attempt Completed</h2>
              <p className="text-xs text-slate-400">Participant: <span className="text-cyan-300 font-semibold">{participant?.name}</span></p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Submission Verified</span>
          </div>
        </div>

        {/* Big Score Spotlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="sm:col-span-1 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center flex flex-col items-center justify-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Your Total Score</p>
            <div className="font-heading text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400">
              {score} <span className="text-xl text-slate-500 font-normal">/ {maxPossibleScore}</span>
            </div>
            <span className="mt-2 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {percentage}% Accuracy
            </span>
          </div>

          <div className="sm:col-span-2 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Correct Answers</p>
                <p className="text-lg font-bold text-slate-100">{correct} <span className="text-xs text-slate-500">questions</span></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/30 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Incorrect</p>
                <p className="text-lg font-bold text-slate-100">{incorrect} <span className="text-xs text-slate-500">questions</span></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Attempted</p>
                <p className="text-lg font-bold text-slate-100">{attempted} <span className="text-xs text-slate-500">/ {totalQuestions}</span></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Time Taken</p>
                <p className="text-lg font-bold text-slate-100 font-mono">{formatSeconds(timeTakenSeconds)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown Preview if provided */}
        {breakdown && breakdown.length > 0 && (
          <div className="mb-8">
            <h4 className="font-heading font-bold text-slate-200 text-sm mb-3">Response Breakdown</h4>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {breakdown.map((item, index) => (
                <div
                  key={item.questionId || index}
                  className={`p-2 rounded-lg border text-center text-xs font-mono font-semibold flex flex-col items-center justify-center ${
                    item.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/60 border-red-500/40 text-red-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-400">Q{index + 1}</span>
                  <span>{item.selectedOptionKey || '-'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Thank you for participating in <strong className="text-cyan-300">FunTech BrainByte '26</strong>! Official society leaderboards will be published after the event.
          </p>
        </div>

      </div>
    </div>
  );
}
