import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900">
              The WordPress
              <span className="text-indigo-600"> Freelance</span> Platform
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto">
              Connect with top WordPress developers and clients. Whether you need
              a custom theme, plugin, or full-site build — wrkdsk.com is where
              WordPress work gets done.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register/freelancer"
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                I'm a Freelancer
              </Link>
              <Link
                href="/register/client"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-zinc-900 font-semibold rounded-xl border border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                I'm a Client
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900">
              Built for WordPress Professionals
            </h2>
            <p className="mt-4 text-zinc-600 max-w-xl mx-auto">
              Everything you need to find work or hire talent in the WordPress ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-zinc-200 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Find WordPress Jobs</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Browse curated WordPress projects from theme development to custom plugins, WooCommerce, and more.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Hire Top Talent</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Post your project and receive proposals from vetted WordPress developers ready to deliver.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Secure Payments</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Work with confidence using our platform. Built for the WordPress community, by the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
            Join the WordPress-focused freelance platform today.
          </p>
          <Link
            href="/register"
            className="inline-flex px-8 py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-bold text-white">wrkdsk.com</p>
          <p className="mt-2 text-sm">
            The WordPress Freelance Platform
          </p>
          <p className="mt-6 text-xs">
            &copy; {new Date().getFullYear()} wrkdsk.com. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
