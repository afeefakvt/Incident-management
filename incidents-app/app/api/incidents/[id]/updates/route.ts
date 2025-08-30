import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { IncidentCommentSchema } from "@/lib/validation/incident";

const prisma = new PrismaClient();

//post comment

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();
  const parsed = IncidentCommentSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  // In real app use req.user.id; here accept client-sent userId for demo
  const userId = Number((body as any).userId ?? 1);
  const upd = await prisma.incidentUpdate.create({
    data: {
      incidentId: id,
      userId,
      message: parsed.data.message,
      updateType: "COMMENT",
    },
    include: { user: true },
  });
  return NextResponse.json(upd, { status: 201 });
}


