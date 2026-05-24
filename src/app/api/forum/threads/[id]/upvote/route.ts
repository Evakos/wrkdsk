import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.threadUpvote.findUnique({
      where: {
        threadId_userId: {
          threadId: id,
          userId: session.user.id,
        },
      },
    });

    if (existing) {
      // Remove upvote
      await prisma.threadUpvote.delete({
        where: { id: existing.id },
      });
      const count = await prisma.threadUpvote.count({
        where: { threadId: id },
      });
      return NextResponse.json({ upvoted: false, count });
    } else {
      // Add upvote
      await prisma.threadUpvote.create({
        data: {
          threadId: id,
          userId: session.user.id,
        },
      });
      const count = await prisma.threadUpvote.count({
        where: { threadId: id },
      });
      return NextResponse.json({ upvoted: true, count });
    }
  } catch (error) {
    console.error("Error toggling upvote:", error);
    return NextResponse.json(
      { error: "Failed to toggle upvote" },
      { status: 500 }
    );
  }
}
