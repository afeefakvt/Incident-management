import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IncidentCreateSchema } from "@/lib/validation/incident";

const prisma = new PrismaClient();

// GET /api/incidents
export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || undefined;
  const severity = searchParams.get("severity") || undefined;
  const carId = searchParams.get("carId")
    ? Number(searchParams.get("carId"))
    : undefined;
  const assignedToId = searchParams.get("assignedToId")
    ? Number(searchParams.get("assignedToId"))
    : undefined;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const query = searchParams.get("query") || undefined;
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const where: any = {};
  
  if (status) where.status = status as any;
  if (severity) where.severity = severity as any;
  if (carId) where.carId = carId;
  if (assignedToId) where.assignedToId = assignedToId;
  if (startDate || endDate)
    where.occurredAt = {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined,
    };
  if (query)
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
    ];
  const [items, total] = await Promise.all([
    prisma.incident.findMany({
      where,
      include: { car: true, reportedBy: true, assignedTo: true },
      orderBy: { occurredAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.incident.count({ where }),
  ]);
  return NextResponse.json({ items, total, page, limit });
}

//POST /api/incidents
export async function POST(req: NextRequest) {  
  try {
    const body = await req.json();
    const parsed = IncidentCreateSchema.safeParse(body);
    console.log("Body received:", body);
console.log("Validation result:", parsed);

    if (!parsed.success) {
      console.error("Validation failed:", parsed.error.format());
  console.log("Received body:", body);
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
        
    const occurredAt = new Date(data.occurredAt as any);
    const created = await prisma.incident.create({
      data: {
        carId: data.carId,
        reportedById: data.reportedById,
        assignedToId: data.assignedToId ?? null,
        title: data.title,
        description: data.description,
        severity: data.severity,
        status: data.status,
        type: data.type,
        location: data.location ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        occurredAt,
        carReadingId: data.carReadingId ?? null,
        images: data.images ?? [],
        documents: data.documents ?? [],
        estimatedCost: data.estimatedCost ?? null,
        // Audit: initial comment
        updates: {
          create: {
            userId: data.reportedById,
            message: "Incidentcreated",
            updateType: "COMMENT",
          },
        },
      },
      include: { updates: true },
    });

    await prisma.notification.create({
      data: {
        message: `New incident reported: ${created.title} (${created.severity})`,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
