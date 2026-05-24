import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const experience = searchParams.get("experience");
  const status = searchParams.get("status") || "open";

  const where: any = { status };

  if (category) where.category = category;
  if (experience) where.experience = experience;

  const jobs = await prisma.job.findMany({
    where,
    include: {
      client: {
        select: { id: true, name: true, image: true },
      },
      _count: {
        select: { proposals: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, budget, category, skills, experience, duration } = await req.json();

    if (!title || !description || !budget || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        budget,
        category,
        skills: skills || "",
        experience: experience || "intermediate",
        duration: duration || "",
        clientId: session.user.id,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Job creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
