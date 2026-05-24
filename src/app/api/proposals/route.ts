import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "freelancer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobId, coverLetter, bidAmount, estimatedDays } = await req.json();

    if (!jobId || !coverLetter || !bidAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await prisma.proposal.findUnique({
      where: {
        jobId_freelancerId: {
          jobId,
          freelancerId: session.user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already submitted a proposal for this job" },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.create({
      data: {
        jobId,
        freelancerId: session.user.id,
        coverLetter,
        bidAmount,
        estimatedDays: estimatedDays || null,
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error("Proposal error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
