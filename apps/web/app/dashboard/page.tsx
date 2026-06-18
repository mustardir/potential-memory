import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

const SESSION_COOKIE = "session_token";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromToken(token);

  if (!user) {
    redirect("/login");
  }

  const [wallet, transactions, investments] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: user.id },
      select: { id: true, balance: true, currency: true },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, type: true, status: true, amount: true, currency: true, description: true, reference: true, createdAt: true },
    }),
    prisma.investment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, status: true, principalAmount: true, currentValue: true, returnRate: true },
    }),
  ]);

  if (!wallet) {
    redirect("/login");
  }

  const totalInvested = investments.reduce((sum, investment) => sum + Number(investment.currentValue), 0);
  const activeInvestments = investments.filter((investment) => investment.status === "ACTIVE").length;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Welcome back</p>
              <h1 className="mt-2 text-4xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
              <p className="mt-2 text-gray-600">Manage your wallet, transactions, and investments from one place.</p>
            </div>
            <div className="rounded-3xl bg-slate-900 px-6 py-4 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Portfolio Value</p>
              <p className="mt-2 text-3xl font-semibold">${totalInvested.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Wallet balance</h2>
            <p className="mt-4 text-3xl font-bold">${Number(wallet.balance).toFixed(2)}</p>
            <p className="mt-2 text-sm text-gray-500">{wallet.currency} balance available</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Open investments</h2>
            <p className="mt-4 text-3xl font-bold">{activeInvestments}</p>
            <p className="mt-2 text-sm text-gray-500">Active investment plans</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Recent transactions</h2>
            <p className="mt-4 text-3xl font-bold">{transactions.length}</p>
            <p className="mt-2 text-sm text-gray-500">Latest activity shown below</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">Recent activity</h2>
            {transactions.length === 0 ? (
              <p className="mt-4 text-gray-500">No recent transactions yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{transaction.status}</p>
                      </div>
                      <p className="text-lg font-semibold">${Number(transaction.amount).toFixed(2)}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{transaction.description ?? "No description"}</p>
                    <p className="mt-2 text-xs text-gray-400">{new Date(transaction.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">Investment summary</h2>
            {investments.length === 0 ? (
              <p className="mt-4 text-gray-500">No active investments yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {investments.map((investment) => (
                  <div key={investment.id} className="rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{investment.name}</p>
                        <p className="text-sm text-gray-500">{investment.status}</p>
                      </div>
                      <p className="text-lg font-semibold">${Number(investment.currentValue).toFixed(2)}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Principal: ${Number(investment.principalAmount).toFixed(2)}</p>
                    <p className="mt-2 text-sm text-gray-500">Return rate: {Number(investment.returnRate).toFixed(2)}%</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
