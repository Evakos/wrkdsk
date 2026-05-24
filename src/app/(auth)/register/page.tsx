import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-zinc-900">Join wrkdsk</h1>
          <p className="mt-2 text-zinc-600">Choose how you want to use the platform</p>
        </div>

        <div className="grid gap-6">
          <Link
            href="/register/freelancer"
            className="group p-6 rounded-2xl border-2 border-zinc-200 hover:border-indigo-500 transition-all hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-200 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                  I'm a Freelancer
                </h2>
                <p className="mt-1 text-zinc-600 text-sm">
                  Find WordPress projects, submit proposals, and grow your freelance business.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/register/client"
            className="group p-6 rounded-2xl border-2 border-zinc-200 hover:border-purple-500 transition-all hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-purple-600 transition-colors">
                  I'm a Client
                </h2>
                <p className="mt-1 text-zinc-600 text-sm">
                  Post WordPress projects and hire top freelance developers.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
