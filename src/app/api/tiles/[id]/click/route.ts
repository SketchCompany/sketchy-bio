import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fire-and-forget click counter (called via navigator.sendBeacon).
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.bentoGridItem.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  } catch {
    // Unknown id or transient error — nothing to report to a beacon.
    return new NextResponse(null, { status: 204 });
  }
  return new NextResponse(null, { status: 204 });
}
