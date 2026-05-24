import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = categorySlug
      ? { category: { slug: categorySlug } }
      : {};

    const [threads, total] = await Promise.all([
      prisma.thread.findMany({
        where,
        orderBy: [
          { pinned: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, image: true, role: true },
          },
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
          _count: {
            select: { replies: true, upvotes: true },
          },
        },
      }),
      prisma.thread.count({ where }),
    ]);

    return NextResponse.json({
      threads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, categorySlug } = await req.json();

    if (!title || !content || !categorySlug) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const thread = await prisma.thread.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        categoryId: category.id,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
        _count: {
          select: { replies: true, upvotes: true },
        },
      },
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
