import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment view count
    await prisma.thread.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    const thread = await prisma.thread.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true, title: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, name: true, image: true, role: true },
            },
            children: {
              orderBy: { createdAt: "asc" },
              include: {
                author: {
                  select: { id: true, name: true, image: true, role: true },
                },
              },
            },
          },
        },
        _count: {
          select: { replies: true, upvotes: true },
        },
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if current user has upvoted
    const session = await auth();
    let userUpvoted = false;
    if (session?.user?.id) {
      const upvote = await prisma.threadUpvote.findUnique({
        where: {
          threadId_userId: {
            threadId: id,
            userId: session.user.id,
          },
        },
      });
      userUpvoted = !!upvote;
    }

    return NextResponse.json({ ...thread, userUpvoted });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 }
    );
  }
}
