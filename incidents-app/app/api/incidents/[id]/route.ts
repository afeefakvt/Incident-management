import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IncidentUpdateSchema } from "@/lib/validation/incident";

const prisma = new PrismaClient();

//get incident details
export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;   //  must await
  const incident = await prisma.incident.findUnique({
    where: { id: Number(id) },
    include: {
      car: true,
      reportedBy: true,
      assignedTo: true,
      carReading: true,
      updates: { include: { user: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(incident);
}

// PUT /api/incidents/[id]
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;   //  must await
  const body = await req.json();


  const parsed = IncidentUpdateSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updated = await prisma.incident.update({
    where: { id: Number(id) },
    data: {
      ...data,
      resolvedAt: data.resolvedAt ? new Date(data.resolvedAt as any) : undefined,
    },
  });

  // Audit logging
  if (data.status) {
    await prisma.incidentUpdate.create({
      data: {
        incidentId: Number(id),
        userId: updated.assignedToId ?? updated.reportedById,
        message: `Status → ${data.status}`,
        updateType: "STATUS_CHANGE",
      },
    });
  }
  if (typeof updated.assignedToId !== "undefined") {
    await prisma.incidentUpdate.create({
      data: {
        incidentId: Number(id),
        userId: updated.assignedToId ?? updated.reportedById,
        message: `Assigned to ${updated.assignedToId ?? "none"}`,
        updateType: "ASSIGNMENT",
      },
    });
  }

  return NextResponse.json(updated);
}
