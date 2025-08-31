import IncidentForm from "@/components/incidents/IncidentsForm";

export default async function Page() {
 
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Create Incident</h1>
      <IncidentForm  />
    </main>
  );
}
