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
    const { content, parentId } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Verify thread exists
    const thread = await prisma.thread.findUnique({ where: { id } });
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    if (thread.locked) {
      return NextResponse.json(
        { error: "Thread is locked" },
        { status: 403 }
      );
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        threadId: id,
        authorId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
      },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
