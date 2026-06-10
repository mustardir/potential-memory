import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fortress — Institutional Wealth Management',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-fortress-midnight text-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fortress-accent to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-white font-semibold tracking-tight text-lg">Fortress</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Platform</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security</span>
            <span className="hover:text-white cursor-pointer transition-colors">About</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm bg-fortress-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Open account
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden hero-grid">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fortress-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-fortress-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-fortress-accent/10 border border-fortress-accent/20 rounded-full px-4 py-1.5 text-xs text-fortress-accent font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-fortress-accent rounded-full animate-pulse" />
            Institutional-grade security
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Wealth that works{' '}
            <span className="text-gradient">as hard</span>
            <br />
            <span className="text-slate-300">as you do.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
            Fortress brings institutional investment infrastructure to individual investors.
            Multi-asset portfolios, real-time analytics, and bank-grade security — 
            all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-fortress-accent hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 text-base"
            >
              Start building wealth
              <span>→</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border border-fortress-border hover:border-slate-500 text-slate-300 hover:text-white font-medium px-8 py-4 rounded-xl transition-all duration-200 text-base"
            >
              Sign into your account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-fortress-border bg-fortress-navy/50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '$4.2B+', label: 'Assets under management' },
            { value: '99.97%', label: 'Platform uptime' },
            { value: '180+', label: 'Countries served' },
            { value: 'SOC 2', label: 'Type II certified' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-white mb-1">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Built for serious investors
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">
            Every tool you need to manage, grow, and protect your capital.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '◈',
                title: 'Multi-asset wallets',
                desc: 'Hold and move capital across asset classes with real-time settlement and institutional-grade custody.',
              },
              {
                icon: '◎',
                title: 'Portfolio analytics',
                desc: 'Risk-adjusted performance metrics, benchmark comparisons, and attribution analysis in one view.',
              },
              {
                icon: '▲',
                title: 'Automated investing',
                desc: 'Set allocation targets and let Fortress rebalance automatically against your chosen benchmark.',
              },
              {
                icon: '⬡',
                title: 'Bank-grade security',
                desc: '256-bit encryption, biometric auth, and real-time fraud monitoring protect every transaction.',
              },
              {
                icon: '◐',
                title: 'Transaction history',
                desc: 'Immutable audit trails, exportable records, and tax-ready summaries for every position.',
              },
              {
                icon: '◉',
                title: 'Admin controls',
                desc: 'Role-based permissions, compliance dashboards, and full user management for enterprise teams.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-fortress-navy border border-fortress-border rounded-xl p-6 hover:border-fortress-accent/30 transition-all duration-200 group"
              >
                <div className="text-2xl text-fortress-accent mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                  {icon}
                </div>
                <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-fortress-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to open your account?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of investors who trust Fortress with their capital.
            Setup takes under two minutes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-fortress-gold hover:bg-yellow-500 text-fortress-midnight font-bold px-10 py-4 rounded-xl transition-all duration-200 text-base"
          >
            Open your account
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fortress-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-fortress-accent/20 flex items-center justify-center">
              <span className="text-fortress-accent text-xs font-bold">F</span>
            </div>
            <span className="text-slate-500 text-sm">© 2024 Fortress Fund. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
