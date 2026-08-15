/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPatientById } from "@/actions/patient-actions";
import { getPrescriptionsByPatient } from "@/actions/prescription-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, FileText, Upload, Star } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PatientDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const patient = await getPatientById(params.id);
  if (!patient) return notFound();

  const prescriptionsList = await getPrescriptionsByPatient(params.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{patient.name}</h2>
          <p className="text-muted-foreground">Patient Information and History</p>
        </div>
        <div className="flex gap-4">
          <Link href={`/upload?patientId=${patient.id}`}>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="h-4 w-4" /> Add Prescription
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Age</span>
              <span className="font-medium">{patient.age}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Gender</span>
              <span className="font-medium">{patient.gender}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" /> {patient.phone}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" /> Prescription History
        </h3>
        
        {prescriptionsList.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              No prescriptions found for this patient.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {prescriptionsList.map((prescription) => (
              <Card key={prescription.id} className="shadow-sm hover:shadow-md transition">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </span>
                          {prescription.important && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" /> Important
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-gray-700">
                        <p className="font-medium text-sm text-muted-foreground mb-1">AI Summary</p>
                        <p>{prescription.aiSummary || "No summary available."}</p>
                      </div>

                      {prescription.medicinesJson ? (
                        <div>
                          <p className="font-medium text-sm text-muted-foreground mb-2">Medicines</p>
                          <div className="flex flex-wrap gap-2">
                            {((prescription.medicinesJson as unknown) as any[]).map((med: any, idx: number) => (
                              <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {String(med.name)} • {String(med.dosage)} • {String(med.frequency)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <Link 
                        href={`/prescriptions/${prescription.id}`}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        View Full Detail
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
