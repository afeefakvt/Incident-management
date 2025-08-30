import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const [total, byStatusRaw, bySeverityRaw, resolved] = await Promise.all([
    prisma.incident.count(),
    prisma.incident.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.incident.groupBy({ by: ["severity"], _count: { severity: true } }),
    prisma.incident.findMany({
      where: { resolvedAt: { not: null } },
      select: { reportedAt: true, resolvedAt: true },
    }),
  ]);
  const byStatus: Record<string, number> = {};
  byStatusRaw.forEach((r: { status: string | number; _count: { status: number; }; }) => (byStatus[r.status] = r._count.status));
  const bySeverity: Record<string, number> = {};
  bySeverityRaw.forEach((r: { severity: string | number; _count: { severity: number; }; }) => (bySeverity[r.severity] = r._count.severity));
  const times = resolved.map(
    (r: { resolvedAt: Date; reportedAt: string | number | Date; }) =>
      new Date(r.resolvedAt as Date).getTime() -
      new Date(r.reportedAt).getTime()
  );
  const avgResolutionTime = times.length
    ? Math.round(times.reduce((a: any, b: any) => a + b, 0) / times.length)
    : 0;
  const openIncidents = await prisma.incident.count({
    where: {
      NOT: {
        status: "CLOSED",
      },
    },
  });
  return NextResponse.json({
    total,
    byStatus,
    bySeverity,
    avgResolutionTime,
    openIncidents,
  });
}
