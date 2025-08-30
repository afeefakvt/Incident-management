"use client";

import { useIncidentStats } from "@/lib/queries/incidents";

export default function IncidentStats() {
  const { data, isLoading } = useIncidentStats();
  if (isLoading) return <div className="p-4">Loading…</div>;
  if (!data) return <div className="p-4">No data available.</div>;
  const s = data;
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card title="Total" value={s.total} />
      <Card title="Open" value={s.openIncidents} />
      <Card
        title="Avg Resolution (hrs)"
        value={Math.round(s.avgResolutionTime / 3600000 || 0)}
      />
      <Card
        title="High/Critical"
        value={(s.bySeverity?.HIGH || 0) + (s.bySeverity?.CRITICAL || 0)}
      />
    </div>
  );
}
function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
