"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const isComingSoon =
    process.env.NEXT_PUBLIC_APP_STATUS === "coming-soon";

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

  // ─── Coming Soon Landing (production with APP_STATUS=coming-soon) ───
  if (isComingSoon) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col">
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
        <div className="flex-1 flex items-center justify-center px-8 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/5 rounded-full mb-12">
              <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
              <span className="text-[11px] tracking-[0.15em] text-black/50 uppercase font-medium">
                Built by WordPress freelancers
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-black/90 tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "'Minigap', serif" }}>
              For the people who
              <br />
              <span className="font-normal italic">build WordPress</span>
            </h1>
            <p className="text-base sm:text-lg text-black/40 font-light leading-relaxed max-w-xl mx-auto mb-14">
              A platform by WordPress freelancers, for WordPress freelancers.
              Constructive feedback, meaningful conversation, and people who want
              to create change — not just churn out projects.
            </p>
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
                <p className={`mt-4 text-xs tracking-wide ${status === "success" ? "text-black/50" : "text-red-500/70"}`}>
                  {message}
                </p>
              )}
              {status !== "success" && (
                <p className="mt-4 text-[11px] text-black/25 tracking-wide">
                  No spam. Just a note when we're ready.
                </p>
              )}
            </form>
            <div className="w-12 h-px bg-black/10 mx-auto my-16" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 text-left">
              <div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-3 font-medium">01</div>
                <h3 className="text-sm font-medium text-black/70 mb-2">Built by us</h3>
                <p className="text-[13px] text-black/35 font-light leading-relaxed">Created by WordPress freelancers who understand the craft, the challenges, and what actually matters.</p>
              </div>
              <div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-3 font-medium">02</div>
                <h3 className="text-sm font-medium text-black/70 mb-2">Meaningful work</h3>
                <p className="text-[13px] text-black/35 font-light leading-relaxed">Projects that matter, conversations that go deeper, and a community that wants to create real change.</p>
              </div>
              <div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-3 font-medium">03</div>
                <h3 className="text-sm font-medium text-black/70 mb-2">Constructive feedback</h3>
                <p className="text-[13px] text-black/35 font-light leading-relaxed">No race-to-the-bottom. Honest critique, thoughtful collaboration, and growth over volume.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-[11px] text-black/20 tracking-wide">&copy; {new Date().getFullYear()} wrkdsk</p>
            <span className="text-[11px] text-black/20 tracking-wide">By WordPress freelancers, for WordPress freelancers</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Full Marketing Page (local dev) ───
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f7]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium tracking-[0.2em] uppercase text-black/80">
            wrkdsk
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/jobs" className="text-[13px] text-black/50 hover:text-black/80 transition-colors">
              Find Work
            </Link>
            <Link href="/community" className="text-[13px] text-black/50 hover:text-black/80 transition-colors">
              Community
            </Link>
            <Link
              href="/login"
              className="text-[13px] px-4 py-1.5 rounded-full bg-black text-white hover:bg-black/80 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] tracking-[0.15em] text-black/50 uppercase font-medium">
              Now accepting freelancers
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-black/90 tracking-tight leading-[1.1] mb-6">
            The WordPress
            <br />
            <span className="font-normal italic">freelancer platform</span>
          </h1>
          <p className="text-base sm:text-lg text-black/40 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Connect with top WordPress clients, find projects that actually
            interest you, and join a community of builders who care about the
            craft — not just the churn.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register/freelancer"
              className="px-8 py-3 bg-black text-white text-sm tracking-wide rounded-full hover:bg-black/80 transition-colors"
            >
              Start Freelancing
            </Link>
            <Link
              href="/register/client"
              className="px-8 py-3 border border-black/20 text-black/70 text-sm tracking-wide rounded-full hover:border-black/40 hover:text-black transition-colors"
            >
              Hire a Freelancer
            </Link>
          </div>
          <p className="mt-6 text-[13px] text-black/30">
            No fees until you land your first project.{" "}
            <span className="text-black/50">Really.</span>
          </p>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="py-12 border-y border-black/5 bg-white/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Freelancers", value: "200+" },
            { label: "Projects Posted", value: "50+" },
            { label: "Community Members", value: "400+" },
            { label: "Avg. Response Time", value: "< 2h" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-light text-black/80">
                {stat.value}
              </div>
              <div className="text-[11px] tracking-[0.15em] uppercase text-black/30 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-24 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.2em] uppercase text-black/30 font-medium">
              How it works
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-black/80 mt-3 tracking-tight">
              For freelancers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Create your profile",
                description:
                  "Showcase your WordPress expertise — themes, plugins, blocks, or full-site builds. Your portfolio, your way.",
              },
              {
                step: "02",
                title: "Browse & apply",
                description:
                  "Find projects that match your skills. Apply with a proposal that shows you understand the work.",
              },
              {
                step: "03",
                title: "Get paid & grow",
                description:
                  "Secure payments, honest reviews, and a reputation that follows you. Build your freelance career here.",
              },
            ].map((item) => (
              <div key={item.step}>
                <div className="text-[11px] tracking-[0.2em] uppercase text-black/20 mb-4 font-medium">
                  {item.step}
                </div>
                <h3 className="text-lg font-medium text-black/70 mb-3">
                  {item.title}
                </h3>
                <p className="text-[14px] text-black/35 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── For Clients ─── */}
      <section className="py-24 px-6 sm:px-8 bg-white/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.2em] uppercase text-black/30 font-medium">
              For clients
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-black/80 mt-3 tracking-tight">
              Hire WordPress experts
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Vetted talent",
                description:
                  "Every freelancer is reviewed. You get people who actually know WordPress — not generalists.",
              },
              {
                title: "Fixed-price or hourly",
                description:
                  "Choose the payment model that works for your project. Milestone-based releases keep you in control.",
              },
              {
                title: "No middleman",
                description:
                  "Communicate directly with freelancers. No algorithms, no bidding wars — just real conversations.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-medium text-black/70 mb-3">
                  {item.title}
                </h3>
                <p className="text-[14px] text-black/35 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/register/client"
              className="inline-block px-8 py-3 border border-black/20 text-black/70 text-sm tracking-wide rounded-full hover:border-black/40 hover:text-black transition-colors"
            >
              Post a Project
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Community Preview ─── */}
      <section className="py-24 px-6 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.2em] uppercase text-black/30 font-medium">
              Community
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-black/80 mt-3 tracking-tight">
              More than a marketplace
            </h2>
            <p className="text-[14px] text-black/35 font-light max-w-xl mx-auto mt-4 leading-relaxed">
              A forum for WordPress freelancers to share knowledge, get
              feedback, and talk shop. No fluff, just real conversations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                title: "Show & Tell",
                desc: "Share your work and get constructive feedback from peers.",
              },
              {
                title: "Tech & Tools",
                desc: "Discuss blocks, themes, plugins, and the WordPress ecosystem.",
              },
              {
                title: "Business of Freelancing",
                desc: "Rates, contracts, clients — the stuff they don't teach you.",
              },
              {
                title: "Job Board",
                desc: "Exclusive projects posted by verified clients.",
              },
            ].map((cat) => (
              <Link
                key={cat.title}
                href="/community"
                className="group p-6 rounded-xl border border-black/5 hover:border-black/10 hover:bg-white/50 transition-all"
              >
                <h3 className="text-sm font-medium text-black/70 group-hover:text-black transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[13px] text-black/35 mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/community"
              className="text-[13px] text-black/50 hover:text-black/80 transition-colors underline underline-offset-4"
            >
              Join the conversation →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA / Waitlist ─── */}
      <section className="py-24 px-6 sm:px-8 bg-black/5">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[11px] tracking-[0.2em] uppercase text-black/30 font-medium">
            Stay in the loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-black/80 mt-3 mb-4 tracking-tight">
            We're just getting started
          </h2>
          <p className="text-[14px] text-black/35 font-light leading-relaxed mb-10 max-w-md mx-auto">
            Get early access, feature updates, and a heads-up when we launch new
            tools for the WordPress freelance community.
          </p>
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
                {status === "loading" ? "Sending" : "Subscribe"}
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
                No spam. Just occasional updates.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-6 sm:px-8 py-8 border-t border-black/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-black/20 tracking-wide order-2 sm:order-1">
            &copy; {new Date().getFullYear()} wrkdsk
          </p>
          <div className="flex items-center gap-6 order-1 sm:order-2">
            <Link href="/jobs" className="text-[11px] text-black/30 hover:text-black/60 transition-colors">
              Find Work
            </Link>
            <Link href="/community" className="text-[11px] text-black/30 hover:text-black/60 transition-colors">
              Community
            </Link>
            <Link href="/login" className="text-[11px] text-black/30 hover:text-black/60 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-[11px] text-black/30 hover:text-black/60 transition-colors">
              Join
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
