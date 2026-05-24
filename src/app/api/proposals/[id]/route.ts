import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  if (!["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { job: true },
  });

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  // Only the job owner (client) can accept/reject proposals
  if (proposal.job.clientId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await prisma.proposal.update({
    where: { id },
    data: { status },
  });

  // If accepting, update job status
  if (status === "accepted") {
    await prisma.job.update({
      where: { id: proposal.jobId },
      data: { status: "in_progress" },
    });
  }

  return NextResponse.json(updated);
}
