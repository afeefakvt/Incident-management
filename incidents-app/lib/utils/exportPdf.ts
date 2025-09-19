import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function exportToPDF(data: any[], filename: string) {
  const doc = new jsPDF()

  const tableColumn = ["Title", "Type", "Severity", "Status", "Occurred At"]

  const tableRows = data.map((row) => [
    row.title,
    row.type,
    row.severity,
    row.status,
    new Date(row.occurredAt).toLocaleString(),
  ])

  doc.text("Incidents Report", 14, 15)

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185] }, // nice blue header
  })

  doc.save(`${filename}.pdf`)
}
