import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-fortress-midnight flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-fortress-accent font-mono text-sm mb-4 tracking-widest uppercase">
          404
        </p>
        <h1 className="font-display text-4xl font-bold text-white mb-4">
          Page not found
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-fortress-accent hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-fortress-border hover:border-slate-500 text-slate-300 hover:text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
