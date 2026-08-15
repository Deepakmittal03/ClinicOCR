/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { processPrescriptionImage, savePrescription } from "@/actions/prescription-actions";
import { toast } from "sonner";
import { Upload, Loader2, CheckCircle2, FileText, Activity } from "lucide-react";
import { ProcessedPrescription } from "@/lib/ocr/gemini";
import { ReviewPrescriptionForm } from "../prescription/ReviewPrescriptionForm";

export function UploadPrescriptionWorkflow({ 
  patients, 
  defaultPatientId 
}: { 
  patients: any[]; 
  defaultPatientId?: string;
}) {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Processing, 3: Review
  const [selectedPatientId, setSelectedPatientId] = useState<string>(defaultPatientId || (patients.length > 0 ? patients[0].id : ""));
  const [file, setFile] = useState<File | null>(null);
  
  const [rawOcr, setRawOcr] = useState<string>("");
  const [processedData, setProcessedData] = useState<ProcessedPrescription | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      toast.error("Please select a prescription image.");
      return;
    }
    if (!selectedPatientId) {
      toast.error("Please select a patient.");
      return;
    }

    setStep(2); // Move to processing state

    const formData = new FormData();
    formData.append("image", file);

    const result = await processPrescriptionImage(formData);

    if (result.success && result.processedData) {
      setRawOcr(result.rawOcr || "");
      setProcessedData(result.processedData);
      setStep(3); // Move to review state
      toast.success("Image processed successfully!");
    } else {
      toast.error(result.error || "Failed to process image");
      setStep(1); // Go back
    }
  };

  const handleSave = async (finalData: ProcessedPrescription) => {
    try {
      setIsSaving(true);
      await savePrescription({
        patientId: selectedPatientId,
        imageUrl: URL.createObjectURL(file!), // In real app, upload to storage
        rawOcr: rawOcr,
        correctedText: finalData.corrected_text,
        aiSummary: finalData.summary,
        medicinesJson: finalData.medicines,
        tags: finalData.tags,
      });
      toast.success("Prescription saved successfully!");
      router.push(`/patients/${selectedPatientId}`);
    } catch (error) {
      toast.error("Failed to save prescription.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 max-w-xl mx-auto">
        <div className={`flex flex-col items-center \${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 \${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Upload</span>
        </div>
        <div className={`h-1 flex-1 mx-4 \${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center \${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 \${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Process</span>
        </div>
        <div className={`h-1 flex-1 mx-4 \${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center \${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 \${step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Review</span>
        </div>
      </div>

      {step === 1 && (
        <Card className="shadow-sm">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Select Patient</label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="" disabled>Select a patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Prescription Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/jpg" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="text-sm font-medium">
                    {file ? file.name : "Click or drag image here"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Supports JPG, JPEG, PNG
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={handleProcess}
              disabled={!file || !selectedPatientId}
            >
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-sm text-center p-12">
          <CardContent className="space-y-6">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Processing Prescription...</h3>
              <p className="text-muted-foreground">Applying Image Optimizations & Tesseract OCR.</p>
              <p className="text-sm text-gray-500">Gemini AI is structuring the medical data.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && processedData && (
        <ReviewPrescriptionForm 
          rawOcr={rawOcr}
          processedData={processedData}
          onSave={handleSave}
          onCancel={() => setStep(1)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
