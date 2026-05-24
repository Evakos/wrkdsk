"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list. We'll be in touch.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <span className="text-sm font-medium tracking-[0.2em] text-white uppercase">
            wrkdsk
          </span>
          <span className="text-[11px] tracking-[0.15em] text-white/60 uppercase">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/5 rounded-full mb-12">
            <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
            <span className="text-[11px] tracking-[0.15em] text-black/50 uppercase font-medium">
              Built by WordPress freelancers
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-black/90 tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "'FlyTrap Extended', serif" }}>
            For the people who
            <br />
            <span className="font-normal italic">build WordPress</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-black/40 font-light leading-relaxed max-w-xl mx-auto mb-14">
            A platform by WordPress freelancers, for WordPress freelancers.
            Constructive feedback, meaningful conversation, and people who want
            to create change — not just churn out projects.
          </p>

          {/* Email signup */}
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                disabled={status === "loading"}
                className="w-full px-0 py-3 bg-transparent border-b border-black/20 text-black/80 text-sm tracking-wide placeholder:text-black/25 focus:outline-none focus:border-black/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] tracking-[0.2em] uppercase text-black/40 hover:text-black/70 transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Sending" : "Notify me"}
              </button>
            </div>
            {message && (
              <p
                className={`mt-4 text-xs tracking-wide ${
                  status === "success" ? "text-black/50" : "text-red-500/70"
                }`}
              >
                {message}
              </p>
            )}
            {status !== "success" && (
              <p className="mt-4 text-[11px] text-black/25 tracking-wide">
                No spam. Just a note when we're ready.
              </p>
            )}
          </form>

          {/* Divider */}
          <div className="w-12 h-px bg-black/10 mx-auto my-16" />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 text-left">
            <div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-3 font-medium">
                01
              </div>
              <h3 className="text-sm font-medium text-black/70 mb-2">
                Built by us
              </h3>
              <p className="text-[13px] text-black/35 font-light leading-relaxed">
                Created by WordPress freelancers who understand the craft, the
                challenges, and what actually matters.
              </p>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-3 font-medium">
                02
              </div>
              <h3 className="text-sm font-medium text-black/70 mb-2">
                Meaningful work
              </h3>
              <p className="text-[13px] text-black/35 font-light leading-relaxed">
                Projects that matter, conversations that go deeper, and a
                community that wants to create real change.
              </p>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-3 font-medium">
                03
              </div>
              <h3 className="text-sm font-medium text-black/70 mb-2">
                Constructive feedback
              </h3>
              <p className="text-[13px] text-black/35 font-light leading-relaxed">
                No race-to-the-bottom. Honest critique, thoughtful collaboration,
                and growth over volume.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-black/20 tracking-wide">
            &copy; {new Date().getFullYear()} wrkdsk
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-black/20 tracking-wide">
              By WordPress freelancers, for WordPress freelancers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
