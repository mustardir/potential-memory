import Card from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Fortress Finance Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="text-lg font-semibold">
            Account Balance
          </h2>
          <p className="text-3xl font-bold">$0.00</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">
            Wallet Balance
          </h2>
          <p className="text-3xl font-bold">$0.00</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">
            Transactions
          </h2>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>
    </main>
  );
}
