export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-zinc-900 to-purple-950 flex flex-col items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo / Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/20 mb-6">
            <span className="text-3xl font-bold text-white">W</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
            wrkdsk
            <span className="text-indigo-400">.com</span>
          </h1>
        </div>

        {/* Launching Soon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          We're Launching Soon
        </div>

        {/* Description */}
        <p className="text-lg sm:text-xl text-zinc-400 mb-12 leading-relaxed">
          The WordPress-focused freelance platform is coming. 
          Connect with top WordPress developers and clients for themes, 
          plugins, and full-site builds.
        </p>

        {/* Email Signup */}
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email for updates"
              className="flex-1 px-5 py-3.5 bg-white/5 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap">
              Notify Me
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-600">
            No spam. We'll only email you when we launch.
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-zinc-800">
            <div className="text-indigo-400 text-sm font-semibold mb-1">For Freelancers</div>
            <div className="text-zinc-500 text-xs">Find WordPress projects that match your skills</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-zinc-800">
            <div className="text-purple-400 text-sm font-semibold mb-1">For Clients</div>
            <div className="text-zinc-500 text-xs">Hire vetted WordPress developers</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-zinc-800">
            <div className="text-green-400 text-sm font-semibold mb-1">WordPress Focused</div>
            <div className="text-zinc-500 text-xs">Built specifically for the WP ecosystem</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} wrkdsk.com. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
