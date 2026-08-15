import { db } from "@/db";
import { patients, prescriptions } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, PlusCircle, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [{ count: patientCount }] = await db.select({ count: count() }).from(patients);
  const [{ count: prescriptionCount }] = await db.select({ count: count() }).from(prescriptions);
  
  const recentPrescriptions = await db.select({
    id: prescriptions.id,
    createdAt: prescriptions.createdAt,
    patientName: patients.name,
    summary: prescriptions.aiSummary
  })
  .from(prescriptions)
  .leftJoin(patients, eq(prescriptions.patientId, patients.id))
  .orderBy(desc(prescriptions.createdAt))
  .limit(5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your clinic&apos;s records</p>
        </div>
        <div className="flex gap-4">
          <Link href="/patients/new">
            <Button variant="outline" className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Patient
            </Button>
          </Link>
          <Link href="/upload">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="h-4 w-4" /> Quick Upload
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientCount}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptionCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPrescriptions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No recent prescriptions found.
            </div>
          ) : (
            <div className="space-y-4">
              {recentPrescriptions.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{prescription.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {prescription.summary || "No summary available"}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
