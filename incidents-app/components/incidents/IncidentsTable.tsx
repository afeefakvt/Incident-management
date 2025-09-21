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
import { FileDown, MessageCircle } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-gray-500">Loading incidents...</div>
      </div>
    );
  }

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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Input
            placeholder="Search incidents..."
            className="sm:max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            onValueChange={(val) =>
              setFilters((f: any) => ({
                ...f,
                status: val === "all" ? undefined : val,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {[
                "PENDING",
                "IN_PROGRESS",
                "RESOLVED",
                "CLOSED",
                "CANCELLED",
              ].map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(val) =>
              setFilters((f: any) => ({
                ...f,
                severity: val === "all" ? undefined : val,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="sm:w-[150px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <FileDown className="h-4 w-4 mr-1" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileDown className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Vehicle</TableHead>
              <TableHead className="font-medium">Severity</TableHead>
              <TableHead className="font-medium">Occurred</TableHead>
              <TableHead className="font-medium">Assignee</TableHead>
              <TableHead className="font-medium">Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it: any) => (
              <TableRow key={it.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <a
                    href={`/fleetmanager/incidents/${it.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {it.title}
                  </a>
                </TableCell>
                <TableCell className="text-gray-600">{it.car?.regNumber || '—'}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${badgeBySeverity(
                      it.severity
                    )}`}
                  >
                    {it.severity}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(it.occurredAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-gray-600">{it.assignedTo?.name ?? "Unassigned"}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIncident(it.id)}
                    className="h-8 px-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {items.map((it: any) => (
          <Card key={it.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-gray-900 pr-2">{it.title}</h3>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${badgeBySeverity(
                    it.severity
                  )}`}
                >
                  {it.severity}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Vehicle:</span> {it.car?.regNumber || '—'}
                </div>
                <div>
                  <span className="font-medium">Assignee:</span> {it.assignedTo?.name || 'Unassigned'}
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {new Date(it.occurredAt).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`/fleetmanager/incidents/${it.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIncident(it.id)}
                  className="ml-auto h-8 px-3"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Comments
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setFilters((f: any) => ({ ...f, page: page - 1 }))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
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
        </div>
      )}

      {selectedIncident && (
        <CommentsModal
          incidentId={selectedIncident}
          open={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}

function badgeBySeverity(s: string) {
  return s === "CRITICAL"
    ? "bg-red-100 text-red-800 border border-red-200"
    : s === "HIGH"
    ? "bg-orange-100 text-orange-800 border border-orange-200"
    : s === "MEDIUM"
    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
    : "bg-green-100 text-green-800 border border-green-200";
}