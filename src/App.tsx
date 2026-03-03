import React, { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { BreakdownSection } from './components/BreakdownSection';
import { CategorizationSection } from './components/CategorizationSection';
import { LogicalAnalysisSection } from './components/LogicalAnalysisSection';
import { CorrectionSection } from './components/CorrectionSection';
import { analyzeTextStructure, performLogicalAnalysis, TextBreakdown, LogicalAnalysisResult } from './services/gemini';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzingStructure, setIsAnalyzingStructure] = useState(false);
  const [textBreakdown, setTextBreakdown] = useState<TextBreakdown | null>(null);
  
  const [selectedSentenceIds, setSelectedSentenceIds] = useState<string[]>([]);
  const [isAnalyzingLogic, setIsAnalyzingLogic] = useState(false);
  const [logicalAnalysis, setLogicalAnalysis] = useState<LogicalAnalysisResult | null>(null);

  const handleAnalyzeStructure = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzingStructure(true);
    try {
      const breakdown = await analyzeTextStructure(inputText);
      setTextBreakdown(breakdown);
      setSelectedSentenceIds([]);
      setLogicalAnalysis(null);
    } catch (error) {
      console.error("Error analyzing structure:", error);
      alert("Failed to analyze the text structure. Please try again.");
    } finally {
      setIsAnalyzingStructure(false);
    }
  };

  const toggleSentenceSelection = (id: string) => {
    setSelectedSentenceIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(sId => sId !== id);
      }
      if (prev.length >= 5) {
        alert("You can select a maximum of 5 sentences for logical analysis.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleAnalyzeLogic = async () => {
    if (selectedSentenceIds.length < 2 || selectedSentenceIds.length > 5 || !textBreakdown) return;
    setIsAnalyzingLogic(true);
    try {
      const selectedSentences = textBreakdown.sentences
        .filter(s => selectedSentenceIds.includes(s.id))
        .map(s => s.text);
      
      const analysis = await performLogicalAnalysis(selectedSentences);
      setLogicalAnalysis(analysis);
    } catch (error) {
      console.error("Error performing logical analysis:", error);
      alert("Failed to perform logical analysis. Please try again.");
    } finally {
      setIsAnalyzingLogic(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Logos</h1>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Propositional Logic Analyzer</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <InputSection 
          inputText={inputText} 
          setInputText={setInputText} 
          onAnalyze={handleAnalyzeStructure} 
          isAnalyzing={isAnalyzingStructure} 
        />

        {textBreakdown && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Breakdown & Categorization */}
            <div className="lg:col-span-5 space-y-8">
              <BreakdownSection 
                breakdown={textBreakdown} 
                selectedSentenceIds={selectedSentenceIds}
                toggleSentenceSelection={toggleSentenceSelection}
              />
              <CategorizationSection categorization={textBreakdown.categorization} />
            </div>

            {/* Right Column: Logical Analysis & Correction */}
            <div className="lg:col-span-7 space-y-8">
              <LogicalAnalysisSection 
                analysis={logicalAnalysis}
                isAnalyzing={isAnalyzingLogic}
                onAnalyze={handleAnalyzeLogic}
                selectedCount={selectedSentenceIds.length}
              />
              {logicalAnalysis && (
                <CorrectionSection originalText={inputText} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
