import IncidentStats from "@/components/incidents/IncidentStats";

export default function Page() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Incidents — Analytics</h1>
      <IncidentStats />
    </main>
  );
}
