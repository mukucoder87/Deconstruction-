import React from 'react';
import { Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { LogicalAnalysisResult } from '../services/gemini';

interface LogicalAnalysisSectionProps {
  analysis: LogicalAnalysisResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  selectedCount: number;
}

export function LogicalAnalysisSection({ analysis, isAnalyzing, onAnalyze, selectedCount }: LogicalAnalysisSectionProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Propositional Logic Analysis</h2>
          <p className="text-sm text-slate-500 mt-1">
            Generate truth tables and evaluate logical consistency.
          </p>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || selectedCount < 2 || selectedCount > 5}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              Analyze Selection
            </>
          )}
        </button>
      </div>

      {selectedCount < 2 && !analysis && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>Please select 2 to 5 consecutive sentences from the Text Deconstruction section above.</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Symbolic Representation */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Symbolic Representation</h3>
            <div className="space-y-4">
              {analysis.formulas.map((formula, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-slate-700 italic mb-2">"{formula.sentence}"</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                      {formula.symbolicRepresentation}
                    </span>
                    <span className="text-sm text-slate-500">{formula.explanation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Truth Table */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Truth Table</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase font-mono border-b border-slate-200">
                  <tr>
                    {analysis.truthTable.headers.map((header, idx) => (
                      <th key={idx} className="px-6 py-3 border-r border-slate-200 last:border-0">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-mono text-slate-600">
                  {analysis.truthTable.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-6 py-3 border-r border-slate-100 last:border-0">
                          <span className={`${cell === 'T' ? 'text-emerald-600 font-bold' : cell === 'F' ? 'text-rose-600 font-bold' : ''}`}>
                            {cell}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Evaluation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EvaluationCard title="Validity" value={analysis.evaluation.validity} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} />
            <EvaluationCard title="Reliability" value={analysis.evaluation.reliability} icon={<Info className="w-5 h-5 text-blue-500" />} />
            <EvaluationCard title="Authenticity" value={analysis.evaluation.authenticity} icon={<CheckCircle2 className="w-5 h-5 text-purple-500" />} />
          </div>

          {/* Incoherence & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-rose-50 p-5 rounded-xl border border-rose-200">
              <h3 className="text-rose-900 font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Logical Fallacies & Incoherence
              </h3>
              {analysis.evaluation.incoherence.length > 0 ? (
                <ul className="space-y-2 text-rose-800 text-sm">
                  {analysis.evaluation.incoherence.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-rose-700 text-sm italic">No logical fallacies detected.</p>
              )}
            </div>

            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200">
              <h3 className="text-emerald-900 font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Recommendations
              </h3>
              {analysis.evaluation.recommendations.length > 0 ? (
                <ul className="space-y-2 text-emerald-800 text-sm">
                  {analysis.evaluation.recommendations.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-emerald-700 text-sm italic">The logic is sound. No recommendations.</p>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function EvaluationCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col gap-2">
      <div className="flex items-center gap-2 text-slate-600 font-medium">
        {icon}
        {title}
      </div>
      <p className="text-slate-900 text-sm leading-relaxed">{value}</p>
    </div>
  );
}
