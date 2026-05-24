"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide header on the landing page
  if (pathname === "/") return null;

  return (
    <header className="border-b border-black/5 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-baseline gap-1">
            <span className="text-lg font-medium tracking-[0.15em] text-black/80 uppercase">
              wrkdsk
            </span>
            <span className="text-[10px] text-black/25">.com</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/jobs"
              className="text-[13px] tracking-wide text-black/50 hover:text-black/80 transition-colors"
            >
              Find Work
            </Link>
            {session?.user ? (
              <>
                {session.user.role === "client" && (
                  <Link
                    href="/jobs/post"
                    className="text-[13px] tracking-wide text-black/50 hover:text-black/80 transition-colors"
                  >
                    Post a Job
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-[13px] tracking-wide text-black/50 hover:text-black/80 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-black/10">
                  <span className="text-[13px] text-black/40">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-[12px] tracking-wide text-black/30 hover:text-black/60 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  href="/login"
                  className="text-[13px] tracking-wide text-black/50 hover:text-black/80 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-[12px] tracking-[0.1em] uppercase text-white bg-black/80 px-5 py-2.5 hover:bg-black transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-black/5 pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/jobs" className="text-[13px] tracking-wide text-black/50 hover:text-black/80">
                Find Work
              </Link>
              {session?.user ? (
                <>
                  {session.user.role === "client" && (
                    <Link href="/jobs/post" className="text-[13px] tracking-wide text-black/50 hover:text-black/80">
                      Post a Job
                    </Link>
                  )}
                  <Link href="/dashboard" className="text-[13px] tracking-wide text-black/50 hover:text-black/80">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-[13px] tracking-wide text-black/30 hover:text-black/60 text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[13px] tracking-wide text-black/50 hover:text-black/80">
                    Sign in
                  </Link>
                  <Link href="/register" className="text-[13px] tracking-wide text-black/80 font-medium">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
