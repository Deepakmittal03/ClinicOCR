import { getPatients } from "@/actions/patient-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "@/components/ui/SearchInput"; // Assume we will create this

export const dynamic = 'force-dynamic';

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams?.search || "";
  const patientsList = await getPatients(search);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">Manage your clinic&apos;s patients</p>
        </div>
        <Link href="/patients/new">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="h-4 w-4" /> Add Patient
          </Button>
        </Link>
      </div>

      <div className="flex items-center py-4">
        <SearchInput placeholder="Search patients..." />
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patientsList.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/patients/${patient.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm", className: "text-blue-600" })}
                    >
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
