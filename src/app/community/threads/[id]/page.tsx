"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Author {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
  title?: string | null;
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  parentId: string | null;
  children: Reply[];
}

interface ThreadDetail {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  locked: boolean;
  viewCount: number;
  createdAt: string;
  author: Author;
  category: { id: string; name: string; slug: string; color: string };
  replies: Reply[];
  _count: { replies: number; upvotes: number };
  userUpvoted: boolean;
}

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchThread = async () => {
    try {
      const res = await fetch(`/api/forum/threads/${id}`);
      if (!res.ok) {
        if (res.status === 404) router.push("/community");
        return;
      }
      const data = await res.json();
      setThread(data);
    } catch (err) {
      console.error("Failed to load thread", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleUpvote = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch(`/api/forum/threads/${id}/upvote`, {
        method: "POST",
      });
      const data = await res.json();
      if (thread) {
        setThread({
          ...thread,
          userUpvoted: data.upvoted,
          _count: { ...thread._count, upvotes: data.count },
        });
      }
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !replyContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/forum/threads/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          parentId: replyTo,
        }),
      });
      if (res.ok) {
        setReplyContent("");
        setReplyTo(null);
        fetchThread();
      }
    } catch (err) {
      console.error("Failed to post reply", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-sm text-black/30">Loading...</div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-sm text-black/40">Thread not found.</div>
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
          <Link
            href={`/community/category/${thread.category.slug}`}
            className="hover:text-black/60 transition-colors"
          >
            {thread.category.name}
          </Link>
          <span>/</span>
          <span className="text-black/50 truncate max-w-[200px]">
            {thread.title}
          </span>
        </div>

        {/* Thread header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: thread.category.color }}
            />
            <span className="text-[11px] tracking-wide text-black/30 uppercase">
              {thread.category.name}
            </span>
            {thread.pinned && (
              <span className="text-[10px] tracking-[0.1em] uppercase text-black/30 border border-black/10 px-1.5 py-0.5">
                Pinned
              </span>
            )}
            {thread.locked && (
              <span className="text-[10px] tracking-[0.1em] uppercase text-red-400/70 border border-red-200/50 px-1.5 py-0.5">
                Locked
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-black/90 tracking-tight mb-4">
            {thread.title}
          </h1>
          <div className="flex items-center gap-4 text-[12px] text-black/30">
            <span>by {thread.author.name || "Anonymous"}</span>
            <span>·</span>
            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
            <span>·</span>
            <span>{thread.viewCount} views</span>
          </div>
        </div>

        {/* Thread content */}
        <div className="bg-white border border-black/5 rounded-sm p-6 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[11px] text-black/30 uppercase shrink-0">
              {thread.author.name?.charAt(0) || "?"}
            </div>
            <div>
              <div className="text-sm font-medium text-black/70">
                {thread.author.name || "Anonymous"}
              </div>
              {thread.author.title && (
                <div className="text-[11px] text-black/25">{thread.author.title}</div>
              )}
            </div>
          </div>
          <div className="text-sm text-black/60 leading-relaxed whitespace-pre-wrap">
            {thread.content}
          </div>
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-black/5">
            <button
              onClick={handleUpvote}
              disabled={!session?.user}
              className={`flex items-center gap-1.5 text-[12px] transition-colors ${
                thread.userUpvoted
                  ? "text-black/70"
                  : "text-black/30 hover:text-black/60"
              } disabled:opacity-40`}
            >
              <span>{thread.userUpvoted ? "♥" : "♡"}</span>
              <span>{thread._count.upvotes}</span>
            </button>
          </div>
        </div>

        {/* Replies */}
        <div className="mb-8">
          <div className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-6">
            {thread._count.replies} {thread._count.replies === 1 ? "Reply" : "Replies"}
          </div>

          {thread.replies.length === 0 ? (
            <div className="text-sm text-black/25 font-light py-8 text-center">
              No replies yet. Start the conversation.
            </div>
          ) : (
            <div className="space-y-4">
              {thread.replies
                .filter((r) => !r.parentId)
                .map((reply) => (
                  <div key={reply.id}>
                    <ReplyCard reply={reply} threadId={id} onReply={setReplyTo} />
                    {reply.children.length > 0 && (
                      <div className="ml-8 mt-3 space-y-3">
                        {reply.children.map((child) => (
                          <ReplyCard
                            key={child.id}
                            reply={child}
                            threadId={id}
                            onReply={setReplyTo}
                            isChild
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Reply form */}
        {session?.user ? (
          <form onSubmit={handleReply} className="bg-white border border-black/5 rounded-sm p-6">
            {replyTo && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-black/40">
                  Replying to a comment
                </span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-[11px] text-black/25 hover:text-black/50"
                >
                  Cancel
                </button>
              </div>
            )}
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={thread.locked ? "This thread is locked." : "Write a reply..."}
              disabled={thread.locked || submitting}
              rows={4}
              className="w-full px-0 py-2 bg-transparent text-sm text-black/70 placeholder:text-black/25 focus:outline-none resize-none border-b border-black/10 focus:border-black/30 transition-colors disabled:opacity-40"
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={!replyContent.trim() || thread.locked || submitting}
                className="text-[12px] tracking-[0.1em] uppercase text-white bg-black/80 px-5 py-2.5 hover:bg-black transition-colors disabled:opacity-30"
              >
                {submitting ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <Link
              href="/login"
              className="text-[12px] tracking-[0.1em] uppercase text-black/50 hover:text-black/80 transition-colors"
            >
              Sign in to reply
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyCard({
  reply,
  threadId,
  onReply,
  isChild,
}: {
  reply: Reply;
  threadId: string;
  onReply: (id: string | null) => void;
  isChild?: boolean;
}) {
  const { data: session } = useSession();

  return (
    <div
      className={`bg-white border border-black/5 rounded-sm p-5 ${
        isChild ? "border-l-2 border-l-black/10" : ""
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-[10px] text-black/30 uppercase shrink-0">
          {reply.author.name?.charAt(0) || "?"}
        </div>
        <div>
          <div className="text-[13px] font-medium text-black/60">
            {reply.author.name || "Anonymous"}
          </div>
          <div className="text-[10px] text-black/25">
            {new Date(reply.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="text-[13px] text-black/50 leading-relaxed whitespace-pre-wrap ml-10">
        {reply.content}
      </div>
      {session?.user && !isChild && (
        <button
          onClick={() => onReply(reply.id)}
          className="ml-10 mt-2 text-[10px] tracking-wide text-black/25 hover:text-black/50 transition-colors"
        >
          Reply
        </button>
      )}
    </div>
  );
}
