import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient();

export async function GET() {
const notifications = await prisma.notification.findMany({
  orderBy: { createdAt: "desc" },
  take: 20,
});
  return NextResponse.json(notifications)
}

export async function POST(req: Request) {
    const body = await req.json()
    const notification = await prisma.notification.create({
      data: {
        role: body.role, // ADMIN | DRIVER | FLEET_MANAGER
        message: body.message,
      },
    })
    return NextResponse.json(notification)
  }

  export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const notification = await prisma.notification.update({
      where: { id: Number(params.id) },
      data: { read: true },
    })
    return NextResponse.json(notification)
  }