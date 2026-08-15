import Tesseract from "tesseract.js";

/**
 * Extracts raw text from an image buffer using Tesseract OCR.
 */
export async function extractTextWithTesseract(imageBuffer: Buffer): Promise<string> {
  try {
    // Tesseract.js accepts a buffer directly in Node environment
    const { data: { text } } = await Tesseract.recognize(
      imageBuffer,
      'eng',
      {
        logger: m => console.log(m), // Optional: log progress
      }
    );

    return text;
  } catch (error) {
    console.error("Error extracting text with Tesseract:", error);
    throw new Error("Failed to extract text from image.");
  }
}
