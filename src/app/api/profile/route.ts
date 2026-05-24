import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      title: true,
      bio: true,
      skills: true,
      hourlyRate: true,
      portfolio: true,
      image: true,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, title, bio, skills, hourlyRate, portfolio } = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(title !== undefined && { title }),
        ...(bio !== undefined && { bio }),
        ...(skills !== undefined && { skills }),
        ...(hourlyRate !== undefined && { hourlyRate }),
        ...(portfolio !== undefined && { portfolio }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        title: true,
        bio: true,
        skills: true,
        hourlyRate: true,
        portfolio: true,
        image: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
