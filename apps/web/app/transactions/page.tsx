import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import TransactionForm from "./TransactionForm";

const SESSION_COOKIE = "session_token";

export default async function TransactionsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromToken(token);

  if (!user) {
    redirect("/login");
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Transactions</p>
              <h1 className="mt-2 text-4xl font-bold text-gray-900">Recent account activity</h1>
            </div>
            <div className="text-sm text-gray-500">Showing the latest 20 entries for your wallet.</div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-semibold text-gray-900">History</h2>
            <div className="mt-6 space-y-4">
              {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet. Use the form to create a deposit, withdrawal, or transfer.</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="rounded-3xl border border-gray-200 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{transaction.type}</p>
                          <p className="text-sm text-gray-500">{transaction.status}</p>
                        </div>
                        <p className="text-xl font-semibold text-gray-900">${Number(transaction.amount).toFixed(2)} {transaction.currency}</p>
                      </div>
                      <div className="mt-3 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                        <p>{transaction.description ?? "No description"}</p>
                        <p>{new Date(transaction.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <TransactionForm />
        </section>
      </div>
    </main>
  );
}
