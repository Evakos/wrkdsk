"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function ClientRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "client" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-6 bg-[#faf9f7]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-light text-black/80 tracking-tight">
            Join as a Client
          </h1>
          <p className="mt-2 text-sm text-black/35 font-light">
            Hire WordPress developers for your projects
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50/50 border border-red-200/50 text-sm text-red-500/80">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-[11px] tracking-[0.15em] uppercase text-black/40 mb-2 font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-0 py-2.5 bg-transparent border-b border-black/20 text-black/70 text-sm tracking-wide placeholder:text-black/20 focus:outline-none focus:border-black/50 transition-colors"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[11px] tracking-[0.15em] uppercase text-black/40 mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-0 py-2.5 bg-transparent border-b border-black/20 text-black/70 text-sm tracking-wide placeholder:text-black/20 focus:outline-none focus:border-black/50 transition-colors"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] tracking-[0.15em] uppercase text-black/40 mb-2 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-0 py-2.5 bg-transparent border-b border-black/20 text-black/70 text-sm tracking-wide placeholder:text-black/20 focus:outline-none focus:border-black/50 transition-colors"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black/80 text-white text-[12px] tracking-[0.15em] uppercase hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-black/35">
          Already have an account?{" "}
          <Link href="/login" className="text-black/60 hover:text-black/80 underline underline-offset-4 decoration-black/20">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
