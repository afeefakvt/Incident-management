import IncidentDetail from "@/components/incidents/IncidentDetail";

export default async function Page({ params }: { params: { id: string } }) {
   const { id } = await params; 
  return (
    <main className="p-4">
      <IncidentDetail id={id} />
    </main>
  );
}
