// lib/utils/exportExcel.ts
import * as XLSX from "xlsx"

export function exportToExcel(data: any[], filename: string) {
  const rows = data.map((row) => ({
    Title: row.title,
    Type: row.type,
    Severity: row.severity,
    Status: row.status,
    "Occurred At": new Date(row.occurredAt).toLocaleString(),
  }))

  // Convert JSON → worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows)

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Incidents")

  // Save as file
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
