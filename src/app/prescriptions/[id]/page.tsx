/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPrescriptionById } from "@/actions/prescription-actions";
import { getPatientById } from "@/actions/patient-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, User, FileText, Pill, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PrescriptionDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const prescription = await getPrescriptionById(params.id);
  if (!prescription) return notFound();

  const patient = await getPatientById(prescription.patientId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <Link href={`/patients/${prescription.patientId}`}>
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prescription Details</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" /> 
            {new Date(prescription.createdAt).toLocaleDateString("en-US", {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        {prescription.important && (
          <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-800 text-sm py-1 px-3">
            <Star className="h-4 w-4 mr-2 fill-amber-500 text-amber-500" /> Important
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" /> AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {prescription.aiSummary || "No summary available."}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-600" /> Medicines
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!prescription.medicinesJson || (prescription.medicinesJson as any[]).length === 0) ? (
                <p className="text-muted-foreground">No medicines recorded.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium rounded-tl-lg">Medicine Name</th>
                        <th className="px-4 py-3 font-medium">Dosage</th>
                        <th className="px-4 py-3 font-medium rounded-tr-lg">Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(prescription.medicinesJson as any[]).map((med, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">{med.name}</td>
                          <td className="px-4 py-3 text-gray-600">{med.dosage}</td>
                          <td className="px-4 py-3 text-gray-600">{med.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Corrected Text</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-gray-50 p-4 rounded-lg border">
                {prescription.correctedText || "Not available"}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm bg-blue-50/50 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <User className="h-5 w-5 text-blue-600" /> Patient Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="text-blue-700">Name</span>
                <span className="font-medium text-blue-950">{patient?.name}</span>
              </div>
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="text-blue-700">Age / Gender</span>
                <span className="font-medium text-blue-950">{patient?.age} / {patient?.gender}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-blue-700">Phone</span>
                <span className="font-medium text-blue-950">{patient?.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(prescription.tags as string[])?.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                    {tag}
                  </Badge>
                ))}
                {(!prescription.tags || (prescription.tags as string[]).length === 0) && (
                  <span className="text-sm text-gray-500">No tags</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
