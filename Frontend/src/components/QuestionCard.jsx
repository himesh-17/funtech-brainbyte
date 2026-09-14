import React from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionKey,
  onSelectOption,
  onNext,
  onPrev,
  isReviewed,
  onToggleReview,
}) {
  if (!question) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative quiz-secure-container select-none">
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 font-mono text-xs">
            {question.marks || 1} {question.marks === 1 ? 'Mark' : 'Marks'}
          </span>
        </div>

        <button
          onClick={onToggleReview}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
            isReviewed
              ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 shadow-md shadow-purple-500/20'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isReviewed ? 'fill-purple-400 text-purple-400' : ''}`} />
          <span>{isReviewed ? 'Review Marked' : 'Mark for Review'}</span>
        </button>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h3 className="font-heading text-lg sm:text-xl font-semibold text-slate-100 leading-relaxed tracking-wide">
          {question.questionText}
        </h3>
      </div>

      {/* Options Grid */}
      <div className="space-y-3 sm:space-y-4 mb-8">
        {question.options && question.options.map((opt) => {
          const isSelected = selectedOptionKey === opt.key;

          return (
            <div
              key={opt.key}
              onClick={() => onSelectOption(opt.key)}
              className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/80 border-cyan-500 text-slate-100 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 group-hover:border-slate-700 group-hover:text-slate-200'
                }`}>
                  {opt.key}
                </div>
                <span className="text-sm font-medium leading-normal">{opt.text}</span>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                isSelected ? 'border-cyan-400 bg-cyan-500/20' : 'border-slate-800 bg-slate-950'
              }`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {selectedOptionKey && (
          <button
            onClick={() => onSelectOption(null)}
            className="text-xs text-slate-400 hover:text-red-400 transition cursor-pointer"
          >
            Clear Option
          </button>
        )}

        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className="px-5 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/60 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 transition cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
