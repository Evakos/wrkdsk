"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  _count: { threads: number };
}

interface Thread {
  id: string;
  title: string;
  pinned: boolean;
  viewCount: number;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null; role: string };
  category: { id: string; name: string; slug: string; color: string };
  _count: { replies: number; upvotes: number };
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentThreads, setRecentThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, threadRes] = await Promise.all([
          fetch("/api/forum/categories"),
          fetch("/api/forum/threads?page=1"),
        ]);
        const cats = await catRes.json();
        const threads = await threadRes.json();
        setCategories(cats);
        setRecentThreads(threads.threads || []);
      } catch (err) {
        console.error("Failed to load community data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-sm text-black/30">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-3">
              Community
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-black/90 tracking-tight">
              Discussions
            </h1>
            <p className="text-sm text-black/40 mt-2 font-light">
              Talk shop, share work, and connect with other WordPress folks.
            </p>
          </div>
          {session?.user && (
            <Link
              href="/community/new"
              className="text-[12px] tracking-[0.1em] uppercase text-white bg-black/80 px-5 py-2.5 hover:bg-black transition-colors shrink-0"
            >
              New Thread
            </Link>
          )}
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/community/category/${cat.slug}`}
              className="group block p-5 bg-white border border-black/5 hover:border-black/20 transition-colors rounded-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <h3 className="text-sm font-medium text-black/70 group-hover:text-black transition-colors">
                  {cat.name}
                </h3>
              </div>
              {cat.description && (
                <p className="text-[13px] text-black/35 font-light leading-relaxed ml-[18px]">
                  {cat.description}
                </p>
              )}
              <div className="mt-3 ml-[18px] text-[11px] text-black/25 tracking-wide">
                {cat._count.threads} thread{cat._count.threads !== 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>

        {/* Recent threads */}
        <div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-6">
            Recent Discussions
          </div>
          {recentThreads.length === 0 ? (
            <div className="text-sm text-black/25 font-light py-12 text-center">
              No discussions yet. Be the first to start one.
            </div>
          ) : (
            <div className="space-y-1">
              {recentThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/community/threads/${thread.id}`}
                  className="group flex items-center gap-4 px-4 py-3 hover:bg-black/[0.02] transition-colors rounded-sm"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: thread.category.color }}
                  />
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
                        {thread.category.name}
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
    </div>
  );
}
