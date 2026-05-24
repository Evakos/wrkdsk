import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "open" },
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

  const categories = [
    "All",
    "WordPress",
    "PHP",
    "Frontend",
    "Plugin",
    "Theme",
    "WooCommerce",
    "Custom Development",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">WordPress Jobs</h1>
        <p className="mt-2 text-zinc-600">
          Find your next WordPress project
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/jobs" : `/jobs?category=${cat.toLowerCase()}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              cat === "All"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-zinc-600 border-zinc-300 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Job Listings */}
      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-zinc-200">
          <p className="text-zinc-600 text-lg">No jobs posted yet.</p>
          <p className="text-zinc-500 text-sm mt-2">Check back soon for new opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block p-6 bg-white rounded-xl border border-zinc-200 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-zinc-900 truncate">
                    {job.title}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {job.category}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {job.budget}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {job.experience}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {job._count.proposals} proposals
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-zinc-500">
                    {job.client.name || "Client"}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
