import IncidentsTable from "@/components/incidents/IncidentsTable";


export default function Page() {
  return (
    <main className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Incidents</h1>
        <a
          href="/fleetmanager/incidents/new"
          className="px-3 py-2 rounded bg-black text-white">
          New Incident
        </a>
      </div>
      <IncidentsTable />
    </main>
  );
}
