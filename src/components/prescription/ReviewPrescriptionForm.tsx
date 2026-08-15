"use client";

import { ProcessedPrescription } from "@/lib/ocr/gemini";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  rawOcr: string;
  processedData: ProcessedPrescription;
  onSave: (data: ProcessedPrescription) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function ReviewPrescriptionForm({ rawOcr, processedData, onSave, onCancel, isSaving }: Props) {
  const [data, setData] = useState<ProcessedPrescription>(processedData);

  const handleAddMedicine = () => {
    setData({
      ...data,
      medicines: [...data.medicines, { name: "", dosage: "", frequency: "" }]
    });
  };

  const handleRemoveMedicine = (index: number) => {
    const newMeds = [...data.medicines];
    newMeds.splice(index, 1);
    setData({ ...data, medicines: newMeds });
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const newMeds = [...data.medicines];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setData({ ...data, medicines: newMeds });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Left side: Raw OCR & Summary */}
      <div className="space-y-6">
        <Card className="shadow-sm border-amber-200">
          <CardHeader className="bg-amber-50 rounded-t-lg pb-4 border-b border-amber-200">
            <CardTitle className="text-amber-800 text-lg">Raw OCR Output</CardTitle>
            <p className="text-xs text-amber-600">Original text from Tesseract before AI correction.</p>
          </CardHeader>
          <CardContent className="p-4 bg-amber-50/30">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono overflow-auto max-h-60">
              {rawOcr}
            </pre>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={data.summary}
              onChange={(e) => setData({ ...data, summary: e.target.value })}
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right side: Editable Data */}
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Extracted Medicines</CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddMedicine} className="h-8 gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.medicines.map((med, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <div className="flex-1 space-y-3">
                  <Input 
                    placeholder="Medicine Name" 
                    value={med.name}
                    onChange={(e) => handleMedicineChange(idx, "name", e.target.value)}
                    className="h-8"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      placeholder="Dosage (e.g. 500mg)" 
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
                      className="h-8"
                    />
                    <Input 
                      placeholder="Frequency (e.g. 1-0-1)" 
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(idx, "frequency", e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveMedicine(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {data.medicines.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No medicines detected.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tags & Important Findings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Generated Tags</p>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {tag}
                  </Badge>
                ))}
                {data.tags.length === 0 && <span className="text-sm text-gray-500">None</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={() => onSave(data)} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Prescription
          </Button>
        </div>
      </div>
    </div>
  );
}
