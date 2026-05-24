"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function NewThreadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("category");
  const { data: session, status } = useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categorySlug, setCategorySlug] = useState(preselectedSlug || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetch("/api/forum/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categorySlug) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categorySlug,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create thread");
      }

      const thread = await res.json();
      router.push(`/community/threads/${thread.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-sm text-black/30">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-black/30 tracking-wide mb-8">
          <Link href="/community" className="hover:text-black/60 transition-colors">
            Community
          </Link>
          <span>/</span>
          <span className="text-black/50">New Thread</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-light text-black/90 tracking-tight mb-10">
          Start a Discussion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-[11px] tracking-[0.2em] uppercase text-black/30 mb-2">
              Category
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-black/10 text-sm text-black/70 focus:outline-none focus:border-black/30 transition-colors appearance-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] tracking-[0.2em] uppercase text-black/30 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 bg-white border border-black/10 text-sm text-black/70 placeholder:text-black/20 focus:outline-none focus:border-black/30 transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[11px] tracking-[0.2em] uppercase text-black/30 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post... (markdown supported)"
              rows={10}
              className="w-full px-4 py-3 bg-white border border-black/10 text-sm text-black/70 placeholder:text-black/20 focus:outline-none focus:border-black/30 transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="text-[12px] text-red-500/70">{error}</div>
          )}

          <div className="flex justify-end gap-4">
            <Link
              href="/community"
              className="text-[12px] tracking-[0.1em] uppercase text-black/30 hover:text-black/60 transition-colors px-5 py-2.5"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="text-[12px] tracking-[0.1em] uppercase text-white bg-black/80 px-6 py-2.5 hover:bg-black transition-colors disabled:opacity-30"
            >
              {submitting ? "Posting..." : "Post Thread"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
