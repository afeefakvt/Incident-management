import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const incidentId = Number(id)

  const comments = await prisma.comment.findMany({
    where: { incidentId: incidentId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(comments)
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const incidentId = Number(id)
  const body = await req.json()

  const created = await prisma.comment.create({
    data: {
      message: body.message,
      incidentId: incidentId,
      userId: body.userId,
    },
    include: { user: true },
  })

  return NextResponse.json(created, { status: 201 })
}