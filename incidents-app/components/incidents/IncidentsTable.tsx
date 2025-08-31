"use client";

import { useState } from "react";
import { useIncidents } from "@/lib/queries/incidents";

export default function IncidentsTable({ initialFilters = {} as any }) {
  const [filters, setFilters] = useState(initialFilters);
  const { data, isLoading } = useIncidents(filters);

  if (isLoading) return <div className="p-4">Loading…</div>;

  const items = data?.items ?? [];
  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          className="input input-bordered px-3 py-2 rounded-lg borderw-64"
          placeholder="Search title/desc/location"
          onChange={(e) =>
            setFilters((f: any) => ({ ...f, query: e.target.value, page: 1 }))
          }
        />
        <select
          className="px-3 py-2 rounded-lg border"
          onChange={(e) =>
            setFilters((f: any) => ({
              ...f,
              status: e.target.value || undefined,
              page: 1,
            }))
          }
        >
          <option value="">All Status</option>
          {["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"].map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
        <select
          className="px-3 py-2 rounded-lg border"
          onChange={(e) =>
            setFilters((f: any) => ({
              ...f,
              severity: e.target.value || undefined,
              page: 1,
            }))
          }
        >
          <option value="">All Severity</option>
          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {/* Table (desktop) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3 w-40">Title</th>
              <th className="p-3 w-28">Car</th>
              <th className="p-3 w-28">Severity</th>
              <th className="p-3 w-32">Status</th>
              <th className="p-3 w-40">Occurred</th>
              <th className="p-3 w-32">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it: any) => (
              <tr key={it.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <a
                    className="underline font-medium text-gray-800"
                    href={`/fleetmanager/incidents/${it.id}`}
                  >
                    {it.title}
                  </a>
                </td>
                <td className="p-3 text-gray-600">{it.car?.regNumber}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${badgeBySeverity(
                      it.severity
                    )}`}
                  >
                    {it.severity}
                  </span>
                </td>
                <td className="p-3">
                  <a
                    className=" font-medium text-orange-800"
                  >
                    {it.status}
                  </a>
                </td>
                <td className="p-3 text-gray-600">
                  {new Date(it.occurredAt).toLocaleString()}
                </td>
                <td className="p-3 text-gray-700 text-xs">
                  {it.assignedTo?.name ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards (mobile) */}
      <div className="md:hidden grid gap-3">
        {items.map((it: any) => (
          <div key={it.id} className="rounded-xl border p-3">
            <div className="font-medium">{it.title}</div>
            <div className="text-xs text-gray-600">{it.car?.regNumber}</div>
            <div className="flex gap-2 my-2">
              <span
                className={`px-2 py-1 rounded text-xs ${badgeBySeverity(
                  it.severity
                )}`}
              >
                {it.severity}
              </span>
              <span className="px-2 py-1 rounded text-xs bggray-100">
                {it.status}
              </span>
            </div>
            <a
              className="text-blue-600 underline text-sm"
              href={`/fleetmanager/incidents/${it.id}`}
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
function badgeBySeverity(s: string) {
  return s === "CRITICAL"
    ? "bg-red-100 text-red-700"
    : s === "HIGH"
    ? "bg-orange-100 text-orange-700"
    : s === "MEDIUM"
    ? "bg-yellow-100 text-yellow-700"
    : "bg-green-100 text-green-700";
}

