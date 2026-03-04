import React, { useState } from 'react';
import { BrainCircuit, BookOpen, ExternalLink } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { BreakdownSection } from './components/BreakdownSection';
import { CategorizationSection } from './components/CategorizationSection';
import { LogicalAnalysisSection } from './components/LogicalAnalysisSection';
import { CorrectionSection } from './components/CorrectionSection';
import { SequenceAnalysisSection } from './components/SequenceAnalysisSection';
import { analyzeTextStructure, performLogicalAnalysis, analyzeSequenceAndFallacies, TextBreakdown, LogicalAnalysisResult, SequenceAnalysisResult } from './services/gemini';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzingStructure, setIsAnalyzingStructure] = useState(false);
  const [textBreakdown, setTextBreakdown] = useState<TextBreakdown | null>(null);
  
  const [selectedSentenceIds, setSelectedSentenceIds] = useState<string[]>([]);
  const [isAnalyzingLogic, setIsAnalyzingLogic] = useState(false);
  const [logicalAnalysis, setLogicalAnalysis] = useState<LogicalAnalysisResult | null>(null);

  const [isAnalyzingSequence, setIsAnalyzingSequence] = useState(false);
  const [sequenceAnalysis, setSequenceAnalysis] = useState<SequenceAnalysisResult | null>(null);

  const handleAnalyzeStructure = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzingStructure(true);
    try {
      const breakdown = await analyzeTextStructure(inputText);
      setTextBreakdown(breakdown);
      setSelectedSentenceIds([]);
      setLogicalAnalysis(null);
      setSequenceAnalysis(null);
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

  const handleAnalyzeSequence = async () => {
    if (!textBreakdown || textBreakdown.sentences.length === 0) return;
    setIsAnalyzingSequence(true);
    try {
      const analysis = await analyzeSequenceAndFallacies(
        textBreakdown.sentences.map(s => ({ id: s.id, text: s.text }))
      );
      setSequenceAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing sequence:", error);
      alert("Failed to analyze the sequence. Please try again.");
    } finally {
      setIsAnalyzingSequence(false);
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
        {/* About the App */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">About the Application</h2>
          <p className="text-slate-600 leading-relaxed max-w-4xl mx-auto">
            This application applies <strong>Propositional Calculus</strong> to deconstruct and analyze written text. By translating prose into formal logical structures, it identifies premises, conclusions, contradictions, and fallacies...
          </p>
        </div>

        <InputSection 
          inputText={inputText} 
          setInputText={setInputText} 
          onAnalyze={handleAnalyzeStructure} 
          isAnalyzing={isAnalyzingStructure} 
        />

        {textBreakdown && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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

            {/* Full Width: Sequence & Fallacy Analysis */}
            <SequenceAnalysisSection 
              analysis={sequenceAnalysis}
              isAnalyzing={isAnalyzingSequence}
              onAnalyze={handleAnalyzeSequence}
              hasSentences={textBreakdown.sentences.length > 0}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 mt-8 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">About the Creator</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Conceptualized and Designed by{' '}
              <a 
                href="https://www.linkedin.com/in/dr-mukunda-upadhyay-692351279/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors inline-flex items-center gap-1"
              >
                Dr.Mukunda Upadhyay <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">References on Propositional Calculus</h3>
            <ul className="text-sm text-slate-600 space-y-3">
              <li>
                <a href="https://uomustansiriyah.edu.iq/media/lectures/6/6_2017_02_08!01_11_58_AM.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-start gap-2">
                  <BookOpen className="w-4 h-4 mt-0.5 shrink-0" /> 
                  <span>Introduction to Propositional Logic (Lectures)</span>
                </a>
              </li>
              <li>
                <a href="https://idm-lab.org/intro-to-ai/problems/solutions-Propositional_Logic.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-start gap-2">
                  <BookOpen className="w-4 h-4 mt-0.5 shrink-0" /> 
                  <span>Propositional Logic Problems & Solutions (IDM Lab)</span>
                </a>
              </li>
              <li>
                <a href="https://www.bspublications.net/downloads/056bd715349356_ch_1_Mathematical%20Foundation%20ofComputer%20Science_Satyanarayana.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-start gap-2">
                  <BookOpen className="w-4 h-4 mt-0.5 shrink-0" /> 
                  <span>Mathematical Foundation of Computer Science (Ch. 1)</span>
                </a>
              </li>
              <li>
                <a href="https://www.hansrajcollege.ac.in/hCPanel/uploads/elearning/elearning_document/logic_problemSet.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-start gap-2">
                  <BookOpen className="w-4 h-4 mt-0.5 shrink-0" /> 
                  <span>Logic Problem Set (Hansraj College)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
