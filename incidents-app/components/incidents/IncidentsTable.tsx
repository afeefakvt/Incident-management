"use client";

import { useState } from "react";
import { useIncidents, useUpdateIncident } from "@/lib/queries/incidents";


export default function IncidentsTable({ initialFilters = {} as any }) {
  const [filters, setFilters] = useState(initialFilters);
  const { data, isLoading } = useIncidents(filters);
  const { mutate } = useUpdateIncident();

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
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Car</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Status</th>
              <th className="p-3">Occurred</th>
              <th className="p-3">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it: any) => (
              <tr key={it.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <a
                    className="underline"
                    href={`/fleetmanager/incidents/${it.id}`}
                  >
                    {it.title}
                  </a>
                </td>
                <td className="p-3">{it.car?.regNumber}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded textxs ${badgeBySeverity(
                      it.severity
                    )}`}
                  >
                    {it.severity}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    defaultValue={it.status}
                    onChange={(e) =>
                      mutate({
                        id: String(it.id),
                        data: { status: e.target.value },
                      })
                    }
                    className="borderrounded px-2 py-1 text-xs">
                    {[
                      "PENDING",
                      "IN_PROGRESS",
                      "RESOLVED",
                      "CLOSED",
                      "CANCELLED",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  {new Date(it.occurredAt).toLocaleString()}
                </td>
                <td className="p-3">
                  <span className="text-xs">{it.assignedTo?.name ?? "—"}</span>
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
                className={`px-2 py-1 rounded text-xs ${badgeBySeverity(it.severity)}`}>
                {it.severity}
              </span>
              <span className="px-2 py-1 rounded text-xs bggray-100">
                {it.status}
              </span>
            </div>
            <a
              className="text-blue-600 underline text-sm"
              href={`/fleetmanager/incidents/${it.id}`}>
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
    ? "bgorange-100 text-orange-700"
    : s === "MEDIUM"
    ? "bg-yellow-100 textyellow-700"
    : "bg-green-100 text-green-700";
}
