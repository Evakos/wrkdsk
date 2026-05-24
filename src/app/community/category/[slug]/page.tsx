"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Thread {
  id: string;
  title: string;
  pinned: boolean;
  viewCount: number;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null; role: string };
  _count: { replies: number; upvotes: number };
}

interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, threadRes] = await Promise.all([
          fetch("/api/forum/categories"),
          fetch(`/api/forum/threads?category=${slug}`),
        ]);
        const cats = await catRes.json();
        const data = await threadRes.json();
        const found = cats.find((c: CategoryInfo) => c.slug === slug);
        setCategory(found || null);
        setThreads(data.threads || []);
      } catch (err) {
        console.error("Failed to load category", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-sm text-black/30">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-sm text-black/40">Category not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-black/30 tracking-wide mb-8">
          <Link href="/community" className="hover:text-black/60 transition-colors">
            Community
          </Link>
          <span>/</span>
          <span className="text-black/50">{category.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h1 className="text-2xl sm:text-3xl font-light text-black/90 tracking-tight">
                {category.name}
              </h1>
            </div>
            {category.description && (
              <p className="text-sm text-black/40 font-light ml-6">
                {category.description}
              </p>
            )}
          </div>
          {session?.user && (
            <Link
              href={`/community/new?category=${slug}`}
              className="text-[12px] tracking-[0.1em] uppercase text-white bg-black/80 px-5 py-2.5 hover:bg-black transition-colors shrink-0"
            >
              New Thread
            </Link>
          )}
        </div>

        {/* Threads */}
        {threads.length === 0 ? (
          <div className="text-sm text-black/25 font-light py-16 text-center">
            No threads in this category yet.
          </div>
        ) : (
          <div className="space-y-1">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/community/threads/${thread.id}`}
                className="group flex items-center gap-4 px-4 py-3 hover:bg-black/[0.02] transition-colors rounded-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {thread.pinned && (
                      <span className="text-[10px] tracking-[0.1em] uppercase text-black/30 border border-black/10 px-1.5 py-0.5">
                        Pinned
                      </span>
                    )}
                    <span className="text-sm text-black/70 group-hover:text-black transition-colors truncate">
                      {thread.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-black/25">
                      {thread.author.name || "Anonymous"}
                    </span>
                    <span className="text-[11px] text-black/20">·</span>
                    <span className="text-[11px] text-black/25">
                      {new Date(thread.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-black/25 shrink-0">
                  <span>{thread._count.replies} replies</span>
                  <span>{thread._count.upvotes} ♡</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
