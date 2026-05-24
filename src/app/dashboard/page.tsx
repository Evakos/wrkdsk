import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true, title: true },
  });

  if (!user) redirect("/login");

  if (user.role === "freelancer") {
    const proposals = await prisma.proposal.findMany({
      where: { freelancerId: session.user.id },
      include: {
        job: {
          select: { title: true, budget: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">
            Welcome back, {user.name}
          </h1>
          <p className="text-zinc-600 mt-1">
            {user.title || "Freelancer"} &middot; Dashboard
          </p>
          <Link
            href="/dashboard/profile"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Edit Profile &rarr;
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-sm text-indigo-600 font-medium">Proposals Sent</p>
            <p className="text-3xl font-bold text-indigo-900 mt-1">{proposals.length}</p>
          </div>
          <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
            <p className="text-sm text-green-600 font-medium">Active Projects</p>
            <p className="text-3xl font-bold text-green-900 mt-1">
              {proposals.filter((p) => p.status === "accepted").length}
            </p>
          </div>
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-sm text-amber-600 font-medium">Pending</p>
            <p className="text-3xl font-bold text-amber-900 mt-1">
              {proposals.filter((p) => p.status === "pending").length}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">Your Proposals</h2>
          <Link
            href="/jobs"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Browse Jobs &rarr;
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-zinc-200">
            <p className="text-zinc-600">You haven't submitted any proposals yet.</p>
            <Link
              href="/jobs"
              className="mt-4 inline-flex px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
            >
              Find WordPress Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="p-5 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-zinc-900">{proposal.job.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      Bid: ${proposal.bidAmount} &middot; {proposal.job.budget}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      proposal.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : proposal.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Client dashboard
  const jobs = await prisma.job.findMany({
    where: { clientId: session.user.id },
    include: {
      _count: { select: { proposals: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">
          Welcome back, {user.name}
        </h1>
        <p className="text-zinc-600 mt-1">Client Dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
          <p className="text-sm text-purple-600 font-medium">Active Jobs</p>
          <p className="text-3xl font-bold text-purple-900 mt-1">
            {jobs.filter((j) => j.status === "open" || j.status === "in_progress").length}
          </p>
        </div>
        <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <p className="text-sm text-indigo-600 font-medium">Total Proposals</p>
          <p className="text-3xl font-bold text-indigo-900 mt-1">
            {jobs.reduce((acc, j) => acc + j._count.proposals, 0)}
          </p>
        </div>
        <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
          <p className="text-sm text-green-600 font-medium">Completed</p>
          <p className="text-3xl font-bold text-green-900 mt-1">
            {jobs.filter((j) => j.status === "completed").length}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-900">Your Jobs</h2>
        <Link
          href="/jobs/post"
          className="text-sm font-medium bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Post a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-zinc-200">
          <p className="text-zinc-600">You haven't posted any jobs yet.</p>
          <Link
            href="/jobs/post"
            className="mt-4 inline-flex px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block p-5 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-zinc-900">{job.title}</h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    {job._count.proposals} proposals &middot; {job.budget}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === "open"
                      ? "bg-green-100 text-green-700"
                      : job.status === "in_progress"
                      ? "bg-blue-100 text-blue-700"
                      : job.status === "completed"
                      ? "bg-zinc-100 text-zinc-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.status.replace("_", " ")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
