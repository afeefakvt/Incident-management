
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient();

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
  ) {
    const { id } = await context.params
    const notification = await prisma.notification.update({
      where: { id: Number(id) },
      data: { read: true },
    })
    return NextResponse.json(notification)
  }