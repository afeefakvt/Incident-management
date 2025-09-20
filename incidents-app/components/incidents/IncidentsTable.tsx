"use client";

import { useState, useEffect } from "react";
import { useIncidents, useUpdateIncident } from "@/lib/queries/incidents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportToPDF } from "@/lib/utils/exportPdf";
import { exportToExcel } from "@/lib/utils/exportExcel";
import { NotificationBell } from "./Bell";
import { CommentsModal } from "../CommentsModal";

export default function IncidentsTable({ initialFilters = {} as any }) {
  const [filters, setFilters] = useState({
    ...initialFilters,
    page: 1,
    limit: 5,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useIncidents(filters);
  const { mutate } = useUpdateIncident();
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((f: any) => ({ ...f, query: searchTerm, page: 1 }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  if (isLoading) return <div className="p-4">Loading…</div>;

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const page = filters.page;
  const limit = filters.limit;
  const totalPages = Math.ceil(total / limit);

  const handleExportExcel = () => {
    exportToExcel(items, "incidents");
  };

  const handleExportPDF = () => {
    exportToPDF(items, "incidents");
  };

  return (
    <div className="space-y-4">
      {/* Top bar with filters + bell */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search title/desc/location"
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            onValueChange={(val) =>
              setFilters((f: any) => ({
                ...f,
                status: val || undefined,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {[
                "PENDING",
                "IN_PROGRESS",
                "RESOLVED",
                "CLOSED",
                "CANCELLED",
              ].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(val) =>
              setFilters((f: any) => ({
                ...f,
                severity: val || undefined,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Severity" />
            </SelectTrigger>
            <SelectContent>
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportExcel}>
              Export Excel
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              Export PDF
            </Button>
          </div>
        </div>

        {/* Notification Bell aligned to right */}
        <NotificationBell />
      </div>

      {/* Table (desktop) */}
      <div className="hidden md:block rounded-xl border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Occurred</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it: any) => (
              <TableRow key={it.id}>
                <TableCell>
                  <a
                    href={`/fleetmanager/incidents/${it.id}`}
                    className="underline text-blue-600"
                  >
                    {it.title}
                  </a>
                </TableCell>
                <TableCell>{it.car?.regNumber}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${badgeBySeverity(
                      it.severity
                    )}`}
                  >
                    {it.severity}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={it.status}
                    onValueChange={(val) =>
                      mutate({ id: String(it.id), data: { status: val } })
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "PENDING",
                        "IN_PROGRESS",
                        "RESOLVED",
                        "CLOSED",
                        "CANCELLED",
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(it.occurredAt).toLocaleString()}
                </TableCell>
                <TableCell>{it.assignedTo?.name ?? "—"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedIncident(it.id)}
                  >
                    Comments
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {selectedIncident && (
            <CommentsModal
              incidentId={selectedIncident}
              open={!!selectedIncident}
              onClose={() => setSelectedIncident(null)}
            />
          )}
        </Table>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden grid gap-3">
        {items.map((it: any) => (
          <Card key={it.id} className="p-4 space-y-2">
            <div className="font-medium">{it.title}</div>
            <div className="text-xs text-gray-600">{it.car?.regNumber}</div>
            <div className="flex gap-2">
              <span
                className={`px-2 py-1 rounded text-xs ${badgeBySeverity(
                  it.severity
                )}`}
              >
                {it.severity}
              </span>
              <span className="px-2 py-1 rounded text-xs bg-gray-100">
                {it.status}
              </span>
            </div>
            <div className="flex gap-2">
              <a
                href={`/fleetmanager/incidents/${it.id}`}
                className="text-blue-600 underline text-sm"
              >
                View
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIncident(it.id)}
              >
                Comments
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setFilters((f: any) => ({ ...f, page: page - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setFilters((f: any) => ({ ...f, page: page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
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
