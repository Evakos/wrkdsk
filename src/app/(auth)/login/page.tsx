"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-6 bg-[#faf9f7]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-light text-black/80 tracking-tight">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-black/35 font-light">
            Welcome back to wrkdsk
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50/50 border border-red-200/50 text-sm text-red-500/80">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-[11px] tracking-[0.15em] uppercase text-black/40 mb-2 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-0 py-2.5 bg-transparent border-b border-black/20 text-black/70 text-sm tracking-wide placeholder:text-black/20 focus:outline-none focus:border-black/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] tracking-[0.15em] uppercase text-black/40 mb-2 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-0 py-2.5 bg-transparent border-b border-black/20 text-black/70 text-sm tracking-wide placeholder:text-black/20 focus:outline-none focus:border-black/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black/80 text-white text-[12px] tracking-[0.15em] uppercase hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-black/35">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-black/60 hover:text-black/80 underline underline-offset-4 decoration-black/20"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
