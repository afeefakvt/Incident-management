import IncidentsTable from "@/components/incidents/IncidentsTable"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Incidents</h1>
            <p className="text-gray-600 mt-1">Manage and track all fleet incidents</p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <a href="/fleetmanager/incidents/new">New Incident</a>
          </Button>
        </div>

        {/* Incidents Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
          <IncidentsTable />
        </div>
      </div>
    </div>
  )
}