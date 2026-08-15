import sharp from "sharp";

/**
 * Preprocesses an image buffer to improve OCR accuracy.
 * Steps: Grayscale, normalize (contrast enhancement), sharpen, and resize if too large.
 */
export async function preprocessImageForOCR(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const processedBuffer = await sharp(imageBuffer)
      .grayscale() // Convert to grayscale
      .normalize() // Enhance contrast
      .sharpen({ sigma: 1, m1: 2, m2: 1, x1: 2, y2: 10, y3: 20 }) // Sharpen text
      .resize({
        width: 2000, // Max width, will maintain aspect ratio
        withoutEnlargement: true,
      })
      .toFormat('jpeg')
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error("Error preprocessing image:", error);
    // Fallback to original image if preprocessing fails
    return imageBuffer;
  }
}
