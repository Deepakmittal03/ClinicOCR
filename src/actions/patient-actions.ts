"use server";

import { db } from "@/db";
import { patients } from "@/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPatients(search?: string) {
  try {
    if (search) {
      return await db.select().from(patients).where(
        or(
          ilike(patients.name, `%${search}%`),
          ilike(patients.phone, `%${search}%`)
        )
      ).orderBy(desc(patients.createdAt));
    }
    return await db.select().from(patients).orderBy(desc(patients.createdAt));
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    throw new Error("Failed to fetch patients");
  }
}

export async function getPatientById(id: string) {
  try {
    const result = await db.select().from(patients).where(eq(patients.id, id));
    return result[0] || null;
  } catch (error) {
    console.error("Failed to fetch patient:", error);
    throw new Error("Failed to fetch patient");
  }
}

export async function createPatient(data: { name: string; age: number; gender: string; phone: string }) {
  try {
    const result = await db.insert(patients).values(data).returning();
    revalidatePath("/patients");
    revalidatePath("/dashboard");
    return result[0];
  } catch (error) {
    console.error("Failed to create patient:", error);
    throw new Error("Failed to create patient");
  }
}

export async function updatePatient(id: string, data: { name?: string; age?: number; gender?: string; phone?: string }) {
  try {
    const result = await db.update(patients).set(data).where(eq(patients.id, id)).returning();
    revalidatePath("/patients");
    revalidatePath(`/patients/${id}`);
    return result[0];
  } catch (error) {
    console.error("Failed to update patient:", error);
    throw new Error("Failed to update patient");
  }
}

export async function deletePatient(id: string) {
  try {
    await db.delete(patients).where(eq(patients.id, id));
    revalidatePath("/patients");
    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    console.error("Failed to delete patient:", error);
    throw new Error("Failed to delete patient");
  }
}
