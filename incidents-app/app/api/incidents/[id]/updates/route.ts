import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IncidentCommentSchema } from "@/lib/validation/incident";

const prisma = new PrismaClient();

//post comment
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;  
  const body = await req.json();

  const parsed = IncidentCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const userId = Number((body as any).userId ?? 1);

  const upd = await prisma.incidentUpdate.create({
    data: {
      incidentId: Number(id),
      userId,
      message: parsed.data.message,
      updateType: "COMMENT",
    },
    include: { user: true },
  });

  return NextResponse.json(upd, { status: 201 });
}


