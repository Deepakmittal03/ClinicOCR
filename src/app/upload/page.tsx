import { getPatients } from "@/actions/patient-actions";
import { UploadPrescriptionWorkflow } from "@/components/upload/UploadPrescriptionWorkflow";

export const dynamic = 'force-dynamic';

export default async function UploadPage({
  searchParams,
}: {
  searchParams: { patientId?: string };
}) {
  const patientsList = await getPatients();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Prescription</h2>
        <p className="text-muted-foreground">Digitize handwritten prescriptions using AI</p>
      </div>
      
      <UploadPrescriptionWorkflow 
        patients={patientsList} 
        defaultPatientId={searchParams.patientId} 
      />
    </div>
  );
}
