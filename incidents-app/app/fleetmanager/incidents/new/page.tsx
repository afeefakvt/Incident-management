import IncidentForm from "@/components/incidents/IncidentsForm";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default async function Page() {
  // In a real app, fetch via API; server side for simplicity here
  const [users, cars] = await Promise.all([
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    prisma.car.findMany({ orderBy: { regNumber: "asc" } }),
  ]);
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Create Incident</h1>
      <IncidentForm users={users} cars={cars} />
    </main>
  );
}
