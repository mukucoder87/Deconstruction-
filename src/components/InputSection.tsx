import React from 'react';
import { Play, Loader2 } from 'lucide-react';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function InputSection({ inputText, setInputText, onAnalyze, isAnalyzing }: InputSectionProps) {
  const wordCount = inputText.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isOverLimit = wordCount > 1000;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Enter Text for Logical Analysis</h2>
          <p className="text-sm text-slate-500 mt-1">
            Type or paste your sentences (up to 1000 words). The system will deconstruct them using propositional calculus.
          </p>
        </div>
        <div className={`text-sm font-medium ${isOverLimit ? 'text-red-500' : 'text-slate-500'}`}>
          {wordCount} / 1000 words
        </div>
      </div>
      
      <textarea
        className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-slate-700 font-sans"
        placeholder="e.g., If it rains, the ground gets wet. It is raining. Therefore, the ground is wet."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || inputText.trim().length === 0 || isOverLimit}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Structure...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Deconstruct Text
            </>
          )}
        </button>
      </div>
    </div>
  );
}
