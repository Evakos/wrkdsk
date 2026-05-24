import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-6 bg-[#faf9f7]">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light text-black/80 tracking-tight">
            Join wrkdsk
          </h1>
          <p className="mt-2 text-sm text-black/35 font-light">
            Choose how you want to use the platform
          </p>
        </div>

        <div className="grid gap-5">
          <Link
            href="/register/freelancer"
            className="group p-6 border border-black/10 hover:border-black/30 transition-all bg-white"
          >
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-colors">
                <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-black/70 group-hover:text-black transition-colors">
                  I'm a Freelancer
                </h2>
                <p className="mt-1 text-[13px] text-black/35 font-light leading-relaxed">
                  Find WordPress projects, submit proposals, and grow your freelance business.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/register/client"
            className="group p-6 border border-black/10 hover:border-black/30 transition-all bg-white"
          >
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-colors">
                <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-medium text-black/70 group-hover:text-black transition-colors">
                  I'm a Client
                </h2>
                <p className="mt-1 text-[13px] text-black/35 font-light leading-relaxed">
                  Post WordPress projects and hire top freelance developers.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <p className="mt-8 text-center text-[13px] text-black/35">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black/60 hover:text-black/80 underline underline-offset-4 decoration-black/20"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
