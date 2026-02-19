import { NextResponse } from "next/server";
import { getEnhancedTransactions } from "@/lib/helius";
import { BOOTSTRAP_WALLET } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 25, 50);

  if (!BOOTSTRAP_WALLET) {
    return NextResponse.json([]);
  }

  const txs = await getEnhancedTransactions(BOOTSTRAP_WALLET, limit);
  return NextResponse.json(
    txs.map((t) => ({
      type: t.type,
      amount: t.amount,
      hash: t.hash,
      timestamp: t.timestamp.toISOString(),
    }))
  );
}
