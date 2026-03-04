import React from 'react';
import { Loader2, AlertOctagon, GitCompare, ListOrdered, Activity } from 'lucide-react';
import { SequenceAnalysisResult } from '../services/gemini';

interface SequenceAnalysisSectionProps {
  analysis: SequenceAnalysisResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  hasSentences: boolean;
}

export function SequenceAnalysisSection({ analysis, isAnalyzing, onAnalyze, hasSentences }: SequenceAnalysisSectionProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Sequence & Fallacy Analysis</h2>
          <p className="text-sm text-slate-500 mt-1">
            Analyze the entire sequence for contradictions, logical ordering, and formal/informal fallacies.
          </p>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !hasSentences}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Sequence...
            </>
          ) : (
            <>
              Analyze Full Sequence
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Overall Flow */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h3 className="text-slate-800 font-semibold mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Overall Logical Flow
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">{analysis.overallFlow}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fallacies */}
            <div className="bg-rose-50 p-5 rounded-xl border border-rose-200 md:col-span-1">
              <h3 className="text-rose-900 font-semibold mb-4 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5" />
                Logical Fallacies
              </h3>
              {analysis.fallacies.length > 0 ? (
                <div className="space-y-4">
                  {analysis.fallacies.map((fallacy, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-rose-100 shadow-sm">
                      <div className="font-bold text-rose-700 text-sm mb-1">{fallacy.fallacyType}</div>
                      <div className="text-xs font-mono text-rose-500 mb-2">
                        Sentences: {fallacy.involvedSentences.join(', ')}
                      </div>
                      <p className="text-rose-800 text-sm">{fallacy.explanation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-rose-700 text-sm italic">No fallacies detected.</p>
              )}
            </div>

            {/* Contradictions */}
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 md:col-span-1">
              <h3 className="text-amber-900 font-semibold mb-4 flex items-center gap-2">
                <GitCompare className="w-5 h-5" />
                Contradictions
              </h3>
              {analysis.contradictions.length > 0 ? (
                <div className="space-y-4">
                  {analysis.contradictions.map((contra, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                      <div className="text-xs font-mono text-amber-600 mb-2">
                        Sentences: {contra.involvedSentences.join(', ')}
                      </div>
                      <p className="text-amber-800 text-sm">{contra.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-700 text-sm italic">No contradictions detected.</p>
              )}
            </div>

            {/* Ordering Issues */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 md:col-span-1">
              <h3 className="text-blue-900 font-semibold mb-4 flex items-center gap-2">
                <ListOrdered className="w-5 h-5" />
                Ordering & Sequence
              </h3>
              {analysis.orderingIssues.length > 0 ? (
                <div className="space-y-4">
                  {analysis.orderingIssues.map((issue, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                      <p className="text-blue-800 text-sm mb-2">{issue.description}</p>
                      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                        <span className="font-semibold">Suggestion:</span> {issue.suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-700 text-sm italic">Sequence is logically ordered.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
