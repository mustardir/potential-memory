"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function InvestmentForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const payload = {
      name,
      principalAmount: Number(principalAmount),
      returnRate: returnRate ? Number(returnRate) : undefined,
      startDate: startDate || undefined,
      maturityDate: maturityDate || undefined,
      currency,
      description: description.trim() || undefined,
    };

    try {
      const response = await fetch("/api/wallet/transactions/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok || !data.success) {
        setError(data.message || "Investment creation failed.");
        return;
      }

      setSuccess("Investment created successfully.");
      setName("");
      setPrincipalAmount("");
      setReturnRate("");
      setStartDate("");
      setMaturityDate("");
      setDescription("");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Investment creation failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Create investment</h2>
        <p className="mt-1 text-sm text-gray-500">Launch a new investment plan based on your available capital.</p>
      </div>

      {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Investment name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
            placeholder="Growth portfolio"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Principal amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={principalAmount}
            onChange={(e) => setPrincipalAmount(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
            placeholder="1000.00"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Expected return rate (%)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={returnRate}
            onChange={(e) => setReturnRate(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
            placeholder="5.5"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Currency</span>
          <input
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
            placeholder="USD"
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Start date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Maturity date</span>
          <input
            type="date"
            value={maturityDate}
            onChange={(e) => setMaturityDate(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full min-h-[100px] rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
          placeholder="Strategy details or notes"
        />
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating investment..." : "Create investment"}
        </button>
      </div>
    </form>
  );
}
