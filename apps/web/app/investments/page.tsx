import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import InvestmentForm from "./InvestmentForm";

const SESSION_COOKIE = "session_token";

export default async function InvestmentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromToken(token);

  if (!user) {
    redirect("/login");
  }

  const investments = await prisma.investment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalValue = investments.reduce((sum, investment) => sum + Number(investment.currentValue), 0);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Investments</p>
              <h1 className="mt-2 text-4xl font-bold text-gray-900">Your portfolio</h1>
            </div>
            <div className="rounded-3xl bg-slate-900 px-6 py-5 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Current value</p>
              <p className="mt-2 text-3xl font-semibold">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-semibold text-gray-900">Active investments</h2>
            <div className="mt-6 space-y-4">
              {investments.length === 0 ? (
                <p className="text-gray-500">You don't have any investments yet. Create one to start building your portfolio.</p>
              ) : (
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div key={investment.id} className="rounded-3xl border border-gray-200 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{investment.name}</p>
                          <p className="text-sm text-gray-500">{investment.status}</p>
                        </div>
                        <p className="text-xl font-semibold text-gray-900">${Number(investment.currentValue).toFixed(2)}</p>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm text-gray-500">
                        <p>Principal: ${Number(investment.principalAmount).toFixed(2)}</p>
                        <p>Return rate: {Number(investment.returnRate).toFixed(2)}%</p>
                        <p>Start: {new Date(investment.startDate).toLocaleDateString()}</p>
                        <p>Maturity: {investment.maturityDate ? new Date(investment.maturityDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <InvestmentForm />
        </section>
      </div>
    </main>
  );
}
