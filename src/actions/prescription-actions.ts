/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use server";

import { db } from "@/db";
import { prescriptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { processPrescriptionImageWithGemini, ProcessedPrescription } from "@/lib/ocr/gemini";

export async function getPrescriptionsByPatient(patientId: string) {
  try {
    return await db.select().from(prescriptions)
      .where(eq(prescriptions.patientId, patientId))
      .orderBy(desc(prescriptions.important), desc(prescriptions.createdAt));
  } catch (error) {
    console.error("Failed to fetch prescriptions:", error);
    throw new Error("Failed to fetch prescriptions");
  }
}

export async function getPrescriptionById(id: string) {
  try {
    const result = await db.select().from(prescriptions).where(eq(prescriptions.id, id));
    return result[0] || null;
  } catch (error) {
    console.error("Failed to fetch prescription:", error);
    throw new Error("Failed to fetch prescription");
  }
}

export async function processPrescriptionImage(formData: FormData) {
  try {
    const file = formData.get("image") as File;
    if (!file) throw new Error("No image uploaded");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";

    console.log("Sending image to Gemini...", { size: buffer.length, mimeType });
    const processedData = await processPrescriptionImageWithGemini(buffer, mimeType);
    console.log("Gemini processing complete!");

    return {
      success: true,
      rawOcr: processedData.corrected_text || "Image processed successfully by AI.",
      processedData,
    };

  } catch (error: any) {
    console.error("Processing failed:", error);
    return { success: false, error: error.message };
  }
}

export async function savePrescription(data: {
  patientId: string;
  imageUrl: string; // From whatever storage we implement or just base64 for now
  rawOcr: string;
  correctedText: string;
  aiSummary: string;
  medicinesJson: any;
  doctorNotes?: string;
  tags?: any;
  important?: boolean;
}) {
  try {
    const result = await db.insert(prescriptions).values({
      ...data,
      // Default to false for important if not provided
      important: data.important ?? false,
    }).returning();
    
    revalidatePath(`/patients/${data.patientId}`);
    revalidatePath("/dashboard");
    return result[0];
  } catch (error) {
    console.error("Failed to save prescription:", error);
    throw new Error("Failed to save prescription");
  }
}
