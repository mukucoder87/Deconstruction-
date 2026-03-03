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

export async function analyzeTextStructure(text: string): Promise<TextBreakdown> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following text and break it down into sentences and phrases. Also categorize the sentences into premises, arguments, assumptions, and conclusions based on their logical function in the text.\n\nText:\n${text}`,
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
                id: { type: Type.STRING, description: 'A unique identifier for the sentence, e.g., s1, s2' },
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
    contents: `Perform a rigorous propositional logic analysis on the following consecutive sentences. 
    1. Convert them into propositional logic symbols (e.g., P, Q, R) and formulas (e.g., P -> Q).
    2. Generate a truth table for these formulas.
    3. Evaluate the logical validity, reliability, and authenticity.
    4. Point out any incoherence or logical fallacies (using Modus Ponens, De Morgan's, etc.).
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
