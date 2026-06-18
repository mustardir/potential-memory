import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

const SESSION_COOKIE = "session_token";

export default async function WalletPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromToken(token);

  if (!user) {
    redirect("/login");
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
  });

  if (!wallet) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Wallet</p>
              <h1 className="mt-2 text-4xl font-bold text-gray-900">Your account balance</h1>
              <p className="mt-3 text-gray-600">Manage your balance and access transaction activity from your wallet.</p>
            </div>
            <div className="rounded-3xl bg-slate-900 px-6 py-5 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Balance</p>
              <p className="mt-2 text-4xl font-semibold">${Number(wallet.balance).toFixed(2)}</p>
              <p className="mt-1 text-sm text-slate-300">{wallet.currency}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Wallet ID</p>
              <p className="mt-2 font-semibold text-gray-900">{wallet.id}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-2 font-semibold text-gray-900">{wallet.isLocked ? "Locked" : "Active"}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Created</p>
              <p className="mt-2 font-semibold text-gray-900">{new Date(wallet.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Last update</p>
              <p className="mt-2 font-semibold text-gray-900">{new Date(wallet.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <a href="/transactions" className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-black">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Transactions</p>
            <p className="mt-3 text-2xl font-semibold text-gray-900">View history</p>
            <p className="mt-2 text-sm text-gray-500">Review deposits, withdrawals, and transfers.</p>
          </a>
          <a href="/investments" className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-black">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Investments</p>
            <p className="mt-3 text-2xl font-semibold text-gray-900">Manage plans</p>
            <p className="mt-2 text-sm text-gray-500">See your positions and open new opportunities.</p>
          </a>
          <a href="/profile" className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-black">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Profile</p>
            <p className="mt-3 text-2xl font-semibold text-gray-900">Update details</p>
            <p className="mt-2 text-sm text-gray-500">Keep your personal profile and KYC data current.</p>
          </a>
        </section>
      </div>
    </main>
  );
}
