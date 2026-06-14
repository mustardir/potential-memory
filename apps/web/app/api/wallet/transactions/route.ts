import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 50);

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 200),
      select: { id: true, type: true, status: true, amount: true, currency: true, description: true, reference: true, createdAt: true },
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { type, amount, currency = "USD", description, recipientWalletId } = body;

    if (!type || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    // Fetch user's wallet
    const senderWallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!senderWallet) return NextResponse.json({ success: false, message: "Sender wallet not found" }, { status: 404 });

    if (type === "DEPOSIT") {
      // Increase balance and record transaction
      const tx = await prisma.$transaction(async (prismaTx) => {
        const updated = await prismaTx.wallet.update({ where: { id: senderWallet.id }, data: { balance: { increment: amount } } });
        const transaction = await prismaTx.transaction.create({ data: { userId: user.id, walletId: senderWallet.id, type: "DEPOSIT", status: "COMPLETED", amount: amount.toString(), currency, description } });
        return { updated, transaction };
      });

      return NextResponse.json({ success: true, data: tx });
    }

    if (type === "WITHDRAWAL") {
      if (Number(senderWallet.balance) < amount) {
        return NextResponse.json({ success: false, message: "Insufficient funds" }, { status: 400 });
      }

      const tx = await prisma.$transaction(async (prismaTx) => {
        const updated = await prismaTx.wallet.update({ where: { id: senderWallet.id }, data: { balance: { decrement: amount } } });
        const transaction = await prismaTx.transaction.create({ data: { userId: user.id, walletId: senderWallet.id, type: "WITHDRAWAL", status: "COMPLETED", amount: amount.toString(), currency, description } });
        return { updated, transaction };
      });

      return NextResponse.json({ success: true, data: tx });
    }

    if (type === "TRANSFER") {
      if (!recipientWalletId) return NextResponse.json({ success: false, message: "recipientWalletId required for transfer" }, { status: 400 });
      if (Number(senderWallet.balance) < amount) return NextResponse.json({ success: false, message: "Insufficient funds" }, { status: 400 });

      const recipientWallet = await prisma.wallet.findUnique({ where: { id: recipientWalletId } });
      if (!recipientWallet) return NextResponse.json({ success: false, message: "Recipient wallet not found" }, { status: 404 });

      const result = await prisma.$transaction(async (prismaTx) => {
        const debit = await prismaTx.wallet.update({ where: { id: senderWallet.id }, data: { balance: { decrement: amount } } });
        const credit = await prismaTx.wallet.update({ where: { id: recipientWallet.id }, data: { balance: { increment: amount } } });
        const txDebit = await prismaTx.transaction.create({ data: { userId: user.id, walletId: senderWallet.id, type: "TRANSFER", status: "COMPLETED", amount: amount.toString(), currency, description } });
        const txCredit = await prismaTx.transaction.create({ data: { userId: recipientWallet.userId, walletId: recipientWallet.id, type: "DEPOSIT", status: "COMPLETED", amount: amount.toString(), currency, description } });
        return { debit, credit, txDebit, txCredit };
      });

      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, message: "Unsupported transaction type" }, { status: 400 });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create transaction" }, { status: 500 });
  }
}
