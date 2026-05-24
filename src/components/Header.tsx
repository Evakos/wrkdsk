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
    <header className="border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">wrkdsk</span>
            <span className="text-xs text-zinc-400 mt-2">.com</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Find Work
            </Link>
            {session?.user ? (
              <>
                {session.user.role === "client" && (
                  <Link
                    href="/jobs/post"
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    Post a Job
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-zinc-200">
                  <span className="text-sm text-zinc-500">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-zinc-100 pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/jobs" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Find Work
              </Link>
              {session?.user ? (
                <>
                  {session.user.role === "client" && (
                    <Link href="/jobs/post" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                      Post a Job
                    </Link>
                  )}
                  <Link href="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-red-500 hover:text-red-700 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                    Sign In
                  </Link>
                  <Link href="/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
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
