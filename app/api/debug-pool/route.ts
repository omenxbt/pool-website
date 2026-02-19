import { NextResponse } from "next/server";
import { BOOTSTRAP_WALLET, HELIUS_API_KEY } from "@/lib/constants";
import { getEnhancedTransactions } from "@/lib/helius";

export async function GET() {
  const raw = await fetch(
    `https://api.helius.xyz/v0/addresses/${BOOTSTRAP_WALLET}/transactions?api-key=${HELIUS_API_KEY}&limit=20`,
    { cache: "no-store" }
  );
  const rawData = await raw.json();

  const parsed = await getEnhancedTransactions(BOOTSTRAP_WALLET, 20);

  return NextResponse.json({
    bootstrapWallet: BOOTSTRAP_WALLET,
    heliusApiKeySet: !!HELIUS_API_KEY,
    rawTransactionCount: rawData?.length ?? 0,
    rawSample: rawData?.slice(0, 3),
    parsedTransactions: parsed,
    lpAddCount: parsed.filter((t: { type: string }) => t.type === "LP_ADD").length,
    feeInCount: parsed.filter((t: { type: string }) => t.type === "FEE_IN").length,
    buybackCount: parsed.filter((t: { type: string }) => t.type === "BUYBACK").length,
  });
}
