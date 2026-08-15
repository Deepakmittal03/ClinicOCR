import { GoogleGenAI } from '@google/genai';

// Note: Ensure GEMINI_API_KEY is set in your environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ProcessedPrescription {
  corrected_text: string;
  summary: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  important_findings: string[];
  tags: string[];
}

const systemPrompt = `You are an expert medical assistant. You will be provided with an image of a handwritten prescription.
Your task is to carefully read the handwriting, extract the text, structure the information, extract medicines, generate a summary, and identify important findings and tags.

Return ONLY a valid JSON object with the following structure:
{
  "corrected_text": "The full text you extracted from the prescription.",
  "summary": "A concise summary of the prescription.",
  "medicines": [
    {
      "name": "Medicine name (prefix with 'Possibly ' if uncertain)",
      "dosage": "Dosage (e.g., 500mg)",
      "frequency": "Frequency (e.g., 1-0-1 or twice a day)"
    }
  ],
  "important_findings": ["Finding 1", "Finding 2"],
  "tags": ["Tag1", "Tag2"]
}

Rules:
1. Never hallucinate missing information.
2. Preserve uncertain text.
3. Prefix unclear medicine names with "Possibly ".
4. Return ONLY the JSON object, with no markdown code blocks or additional text.
`;

export async function processPrescriptionImageWithGemini(imageBuffer: Buffer, mimeType: string): Promise<ProcessedPrescription> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { text: "Extract the details from this prescription image according to the system instructions." },
        { inlineData: { data: imageBuffer.toString("base64"), mimeType } }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || "{}";
    
    // Attempt to parse the JSON
    const parsedData = JSON.parse(responseText) as ProcessedPrescription;
    return parsedData;

  } catch (error) {
    console.error("Error processing image with Gemini:", error);
    throw new Error("Failed to process prescription image with AI.");
  }
}
