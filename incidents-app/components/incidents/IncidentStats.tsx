"use client"

import { useIncidentStats } from "@/lib/queries/incidents"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"

const COLORS = ["#2563eb", "#16a34a", "#facc15", "#ef4444", "#9333ea"]

export default function IncidentStats() {
  const { data, isLoading } = useIncidentStats()

  if (isLoading) return <div className="p-4">Loading…</div>
  if (!data) return <div className="p-4">No data available</div> // Handle undefined data

  const s = data
  // Format data for charts
  const statusData = Object.entries(s.byStatus || {}).map(([k, v]) => ({
    name: k,
    value: v,
  }))

  const severityData = Object.entries(s.bySeverity || {}).map(([k, v]) => ({
    name: k,
    value: v,
  }))
//   console.log("Stats data", s)
// console.log("statusData", statusData)
// console.log("severityData", severityData)



  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total Incidents" value={s.total} />
        <StatCard title="Open Incidents" value={s.openIncidents} />
        <StatCard
          title="Avg Resolution (hrs)"
          value={Math.round((s.avgResolutionTime / 3600000) || 0)}
        />
        <StatCard
          title="High/Critical"
          value={(s.bySeverity?.HIGH || 0) + (s.bySeverity?.CRITICAL || 0)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Severity Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}
