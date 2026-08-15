import { PatientForm } from "@/components/forms/PatientForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPatientPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Patient</h2>
        <p className="text-muted-foreground">Register a new patient into the system</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm />
        </CardContent>
      </Card>
    </div>
  );
}
