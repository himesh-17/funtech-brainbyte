import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, HelpCircle } from 'lucide-react';
import axios from 'axios';

export default function QuestionModal({ adminSecret, questionToEdit, onClose, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    questionText: '',
    options: [
      { key: 'A', text: '' },
      { key: 'B', text: '' },
      { key: 'C', text: '' },
      { key: 'D', text: '' },
    ],
    correctOptionKey: 'A',
    marks: 1,
    order: 1,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (questionToEdit) {
      setFormData({
        questionText: questionToEdit.questionText || '',
        options: questionToEdit.options || [
          { key: 'A', text: '' },
          { key: 'B', text: '' },
          { key: 'C', text: '' },
          { key: 'D', text: '' },
        ],
        correctOptionKey: questionToEdit.correctOptionKey || 'A',
        marks: questionToEdit.marks || 1,
        order: questionToEdit.order || 1,
      });
    }
  }, [questionToEdit]);

  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index].text = value;
    setFormData({ ...formData, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const headers = { 'x-admin-secret': adminSecret };
      if (questionToEdit && questionToEdit._id) {
        // Edit PUT
        await axios.put(`/admin/questions/${questionToEdit._id}`, formData, { headers });
      } else {
        // Create POST
        await axios.post('/admin/questions', formData, { headers });
      }
      onSaveSuccess();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Failed to save question.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <h3 className="font-heading text-xl font-bold text-white">
            {questionToEdit ? 'Edit Question' : 'Add New Question'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Question Statement
            </label>
            <textarea
              required
              rows={3}
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              placeholder="e.g. What is the time complexity of searching in a balanced Binary Search Tree?"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Answer Options
            </label>
            <div className="space-y-3">
              {formData.options.map((opt, idx) => (
                <div key={opt.key} className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-cyan-400 shrink-0">
                    {opt.key}
                  </span>
                  <input
                    type="text"
                    required
                    value={opt.text}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${opt.key} text`}
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, correctOptionKey: opt.key })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${
                      formData.correctOptionKey === opt.key
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {formData.correctOptionKey === opt.key ? 'Correct Answer' : 'Set Correct'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Marks & Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Marks
              </label>
              <input
                type="number"
                min={1}
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Display Order #
              </label>
              <input
                type="number"
                min={1}
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-heading font-semibold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-lg shadow-cyan-500/20"
            >
              {loading ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
