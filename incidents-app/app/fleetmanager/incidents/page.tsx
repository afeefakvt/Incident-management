import IncidentsTable from "@/components/incidents/IncidentsTable"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Incidents</h1>
        <Button asChild>
          <a href="/fleetmanager/incidents/new">New Incident</a>
        </Button>
      </div>

      <IncidentsTable />
    </main>
  )
}
