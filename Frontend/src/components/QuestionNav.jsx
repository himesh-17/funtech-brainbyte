import React from 'react';
import { Bookmark, CheckCircle, Circle } from 'lucide-react';

export default function QuestionNav({
  questions,
  currentIndex,
  onSelectQuestion,
  answersMap,
  reviewedSet,
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <h4 className="font-heading font-bold text-slate-200 text-sm">Question Matrix</h4>
        <span className="text-xs text-slate-400 font-mono">{questions.length} Items</span>
      </div>

      {/* Grid of Question Chips */}
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answersMap[q._id] !== undefined;
          const isReviewed = reviewedSet.has(q._id);

          let stateStyles = "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700";

          if (isCurrent) {
            stateStyles = "bg-cyan-500 text-slate-950 border-cyan-400 font-bold ring-2 ring-cyan-500/40 shadow-md shadow-cyan-500/20";
          } else if (isReviewed) {
            stateStyles = "bg-purple-950/80 text-purple-300 border-purple-500/50 font-medium";
          } else if (isAnswered) {
            stateStyles = "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 font-medium";
          }

          return (
            <button
              key={q._id || idx}
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-10 rounded-xl border text-xs flex items-center justify-center transition cursor-pointer ${stateStyles}`}
            >
              <span>{idx + 1}</span>
              {isReviewed && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-400 ring-2 ring-slate-900"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-md bg-emerald-500"></span>
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-md bg-cyan-400"></span>
            <span>Current</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-md bg-purple-500"></span>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-md bg-slate-800 border border-slate-700"></span>
            <span>Unattempted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
