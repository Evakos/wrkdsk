import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import JobDetailClient from "./JobDetailClient";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      client: {
        select: { id: true, name: true, image: true },
      },
      proposals: {
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              image: true,
              title: true,
              hourlyRate: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job) notFound();

  return (
    <JobDetailClient
      job={JSON.parse(JSON.stringify(job))}
      userId={session?.user?.id || null}
      userRole={session?.user?.role || null}
    />
  );
}
