import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserMenu } from "./UserMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fortress Finance | Fintech Dashboard",
  description: "Secure financial management and investment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <a href="/" className="text-lg font-semibold tracking-tight text-slate-900">
              Fortress Finance
            </a>
            <nav className="flex flex-1 flex-wrap items-center gap-3 text-sm text-slate-600">
              <a href="/dashboard" className="transition hover:text-slate-900">
                Dashboard
              </a>
              <a href="/wallet" className="transition hover:text-slate-900">
                Wallet
              </a>
              <a href="/transactions" className="transition hover:text-slate-900">
                Transactions
              </a>
              <a href="/investments" className="transition hover:text-slate-900">
                Investments
              </a>
              <a href="/profile" className="transition hover:text-slate-900">
                Profile
              </a>
            </nav>

            <div className="flex-shrink-0">
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
