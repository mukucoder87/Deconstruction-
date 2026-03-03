import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env if .env.local isn't sufficient

const app = express();
const PORT = process.env.PORT || 3001;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// API Endpoints
app.post('/api/analyze-structure', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

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

    res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error('Error analyzing structure:', error);
    res.status(500).json({ error: 'Failed to analyze text structure' });
  }
});

app.post('/api/analyze-logic', async (req, res) => {
  try {
    const { sentences } = req.body;
    if (!sentences || !Array.isArray(sentences)) {
      return res.status(400).json({ error: 'Sentences array is required' });
    }

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

    res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error('Error analyzing logic:', error);
    res.status(500).json({ error: 'Failed to perform logical analysis' });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
