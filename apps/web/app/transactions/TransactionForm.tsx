"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";

export default function TransactionForm() {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>("DEPOSIT");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [recipientWalletId, setRecipientWalletId] = useState("");
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
      type,
      amount: Number(amount),
      currency,
      description: description.trim() || undefined,
      recipientWalletId: type === "TRANSFER" ? recipientWalletId.trim() || undefined : undefined,
    };

    try {
      const response = await fetch("/api/wallet/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok || !data.success) {
        setError(data.message || "Transaction failed. Please check your input.");
        return;
      }

      setSuccess("Transaction completed successfully.");
      setAmount("");
      setDescription("");
      setRecipientWalletId("");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Transaction failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">New transaction</h2>
        <p className="mt-1 text-sm text-gray-500">Deposit, withdraw, or transfer funds from your wallet.</p>
      </div>

      {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
          >
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
            placeholder="100.00"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Currency</span>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
            placeholder="USD"
            required
          />
        </label>

        {type === "TRANSFER" ? (
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Recipient wallet ID</span>
            <input
              value={recipientWalletId}
              onChange={(e) => setRecipientWalletId(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
              placeholder="Recipient wallet ID"
              required
            />
          </label>
        ) : null}
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full min-h-[100px] rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-black"
          placeholder="Optional note or reference"
        />
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Processing..." : "Submit transaction"}
        </button>
      </div>
    </form>
  );
}
