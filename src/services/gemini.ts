export interface TextBreakdown {
  sentences: {
    id: string;
    text: string;
    phrases: {
      id: string;
      text: string;
      words: string[];
    }[];
  }[];
  categorization: {
    premises: string[];
    arguments: string[];
    assumptions: string[];
    conclusions: string[];
  };
}

export interface LogicalAnalysisResult {
  formulas: {
    sentenceId: string;
    sentence: string;
    symbolicRepresentation: string;
    explanation: string;
  }[];
  truthTable: {
    headers: string[];
    rows: string[][];
  };
  evaluation: {
    validity: string;
    reliability: string;
    authenticity: string;
    incoherence: string[];
    recommendations: string[];
  };
}

export async function analyzeTextStructure(text: string): Promise<TextBreakdown> {
  const response = await fetch('/api/analyze-structure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze text structure');
  }

  const parsed = await response.json();

  // Post-process to add words array client-side to save massive API token generation time
  if (parsed.sentences) {
    parsed.sentences = parsed.sentences.map((sentence: any) => ({
      ...sentence,
      phrases: (sentence.phrases || []).map((phrase: any) => ({
        ...phrase,
        words: phrase.text ? phrase.text.split(/\s+/).filter(Boolean) : []
      }))
    }));
  }

  return parsed as TextBreakdown;
}

export async function performLogicalAnalysis(sentences: string[]): Promise<LogicalAnalysisResult> {
  const response = await fetch('/api/analyze-logic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentences })
  });

  if (!response.ok) {
    throw new Error('Failed to perform logical analysis');
  }

  const parsed = await response.json();
  return parsed as LogicalAnalysisResult;
}
