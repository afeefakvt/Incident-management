import IncidentDetail from "@/components/incidents/IncidentDetail";


export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="p-4">
      <IncidentDetail id={params.id} />
    </main>
  );
}
