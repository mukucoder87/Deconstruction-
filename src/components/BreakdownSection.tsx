import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { TextBreakdown } from '../services/gemini';
import { cn } from '../lib/utils';

interface BreakdownSectionProps {
  breakdown: TextBreakdown;
  selectedSentenceIds: string[];
  toggleSentenceSelection: (id: string) => void;
}

export function BreakdownSection({ breakdown, selectedSentenceIds, toggleSentenceSelection }: BreakdownSectionProps) {
  const [expandedSentences, setExpandedSentences] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedSentences(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Text Deconstruction</h2>
      <p className="text-sm text-slate-500 mb-6">
        Select 2 to 5 consecutive sentences to perform a rigorous propositional logic analysis.
      </p>

      <div className="space-y-4">
        {breakdown.sentences.map((sentence) => {
          const isSelected = selectedSentenceIds.includes(sentence.id);
          const isExpanded = expandedSentences.has(sentence.id);

          return (
            <div 
              key={sentence.id} 
              className={cn(
                "border rounded-xl overflow-hidden transition-colors",
                isSelected ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-start p-4 gap-3">
                <button 
                  onClick={() => toggleSentenceSelection(sentence.id)}
                  className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                
                <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(sentence.id)}>
                  <p className="text-slate-800 font-medium leading-relaxed">{sentence.text}</p>
                </div>

                <button 
                  onClick={() => toggleExpand(sentence.id)}
                  className="mt-1 text-slate-400 hover:text-slate-600"
                >
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>

              {isExpanded && (
                <div className="p-4 pt-0 pl-12 border-t border-slate-100 bg-slate-50/50">
                  <div className="space-y-3 mt-3">
                    {sentence.phrases.map((phrase, idx) => (
                      <div key={phrase.id || idx} className="text-sm">
                        <span className="font-semibold text-slate-600 mr-2">Phrase {idx + 1}:</span>
                        <span className="text-slate-800">{phrase.text}</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {phrase.words.map((word, wIdx) => (
                            <span key={wIdx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-500 font-mono">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
