import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

export interface SequenceAnalysisResult {
  contradictions: {
    involvedSentences: string[];
    description: string;
  }[];
  orderingIssues: {
    description: string;
    suggestion: string;
  }[];
  fallacies: {
    involvedSentences: string[];
    fallacyType: string;
    explanation: string;
  }[];
  overallFlow: string;
}

export async function analyzeTextStructure(text: string): Promise<TextBreakdown> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following text strictly through the lens of Propositional Calculus (0th-order logic). Break it down into sentences and atomic propositional phrases. Assign an ID to each sentence strictly in the format S1, S2, S3, etc. Categorize the sentences into premises, arguments, assumptions, and conclusions based purely on their logical function as propositional variables and connectives. For categorization, prefix each string with its corresponding sentence ID like '[S1] The text...'\n\nText:\n${text}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: 'A unique identifier for the sentence, strictly formatted as S1, S2, S3, etc.' },
                text: { type: Type.STRING, description: 'The full text of the sentence' },
                phrases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          },
          categorization: {
            type: Type.OBJECT,
            properties: {
              premises: { type: Type.ARRAY, items: { type: Type.STRING } },
              arguments: { type: Type.ARRAY, items: { type: Type.STRING } },
              assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
              conclusions: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        required: ['sentences', 'categorization']
      }
    }
  });

  const parsed = JSON.parse(response.text || '{}') as any;
  
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
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Perform a rigorous propositional logic analysis on the following consecutive sentences. You must strictly use Propositional Calculus (0th-order logic) and avoid informal heuristics. Base your formalization on the foundational works of mathematical logic (e.g., Mendelson's 'Introduction to Mathematical Logic', Enderton's 'A Mathematical Introduction to Logic', Barwise & Etchemendy's 'Language, Proof and Logic', Bell & Machover, Novikov, Rasiowa & Sikorski, and cybernetics/systems theory by Ashby and Leibniz).
    
    1. Convert them into propositional logic symbols (e.g., P, Q, R) and formulas (e.g., P -> Q, P ^ Q).
    2. Generate a truth table for these formulas.
    3. Evaluate the logical validity, reliability, and authenticity based strictly on truth-functional semantics.
    4. Point out any incoherence or logical fallacies (using formal propositional rules like Modus Ponens, Modus Tollens, De Morgan's laws, etc.).
    5. Provide recommendations to improve logical consistency.
    
    Sentences to analyze:
    ${sentences.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          formulas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sentenceId: { type: Type.STRING },
                sentence: { type: Type.STRING },
                symbolicRepresentation: { type: Type.STRING, description: 'e.g., P -> Q' },
                explanation: { type: Type.STRING, description: 'Explanation of the symbolic representation' }
              }
            }
          },
          truthTable: {
            type: Type.OBJECT,
            properties: {
              headers: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'e.g., ["P", "Q", "P -> Q"]' },
              rows: {
                type: Type.ARRAY,
                items: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'e.g., ["T", "T", "T"]'
                }
              }
            }
          },
          evaluation: {
            type: Type.OBJECT,
            properties: {
              validity: { type: Type.STRING },
              reliability: { type: Type.STRING },
              authenticity: { type: Type.STRING },
              incoherence: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of logical fallacies or incoherences' },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Recommendations for improvement' }
            }
          }
        },
        required: ['formulas', 'truthTable', 'evaluation']
      }
    }
  });

  return JSON.parse(response.text || '{}') as LogicalAnalysisResult;
}

export async function analyzeSequenceAndFallacies(sentences: {id: string, text: string}[]): Promise<SequenceAnalysisResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `Analyze the following sequence of sentences for logical flow, contradictions, and fallacies strictly using Propositional Calculus. Reference standard propositional logic and discrete math foundations (e.g., Mendelson, Enderton, Barwise, Bell, Buss).
    
    1. Identify any logical contradictions between sentences using truth-functional analysis.
    2. Evaluate the choice of order (logical sequence) and point out any structural issues in the deduction.
    3. Identify any logical fallacies (e.g., Affirming the Consequent, Denying the Antecedent) and specify the exact type, focusing on formal propositional fallacies.
    4. Provide an overall assessment of the logical flow.
    
    Sentences to analyze:
    ${sentences.map(s => `[${s.id}] ${s.text}`).join('\n')}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          contradictions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                involvedSentences: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'e.g., ["S1", "S3"]' },
                description: { type: Type.STRING }
              }
            }
          },
          orderingIssues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                suggestion: { type: Type.STRING }
              }
            }
          },
          fallacies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                involvedSentences: { type: Type.ARRAY, items: { type: Type.STRING } },
                fallacyType: { type: Type.STRING, description: 'The specific name of the fallacy' },
                explanation: { type: Type.STRING }
              }
            }
          },
          overallFlow: { type: Type.STRING }
        },
        required: ['contradictions', 'orderingIssues', 'fallacies', 'overallFlow']
      }
    }
  });

  return JSON.parse(response.text || '{}') as SequenceAnalysisResult;
}
