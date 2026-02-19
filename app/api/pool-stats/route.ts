import { NextResponse } from "next/server";
import {
  POOL_TOKEN_MINT,
  BOOTSTRAP_WALLET,
  HELIUS_API_KEY,
  INITIAL_GRADUATION_LIQUIDITY_SOL,
} from "@/lib/constants";

/** Fetch SOL price in USD from CoinGecko (no key required). */
async function getSolPriceUsd(): Promise<number> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return 0;
  const data = (await res.json()) as { solana?: { usd?: number } };
  return data?.solana?.usd ?? 0;
}

/** Pool depth in SOL and depth growth % from DexScreener. */
async function fetchDepthFromDexScreener(
  poolMint: string
): Promise<{ depthSol: number; depthGrowth: number }> {
  const baseline = INITIAL_GRADUATION_LIQUIDITY_SOL;
  if (!poolMint) return { depthSol: 0, depthGrowth: 0 };

  const [dexRes, solPrice] = await Promise.all([
    fetch(`https://api.dexscreener.com/latest/dex/tokens/${poolMint}`, {
      next: { revalidate: 30 },
    }),
    getSolPriceUsd(),
  ]);

  if (!dexRes.ok || !solPrice || solPrice <= 0) return { depthSol: 0, depthGrowth: 0 };

  const data = (await dexRes.json()) as {
    pairs?: Array<{
      liquidity?: { usd?: number };
      chainId?: string;
      dexId?: string;
    }>;
  };

  const pairs = data?.pairs ?? [];
  const solanaPair = pairs.find((p) => p.chainId === "solana") ?? pairs[0];
  if (!solanaPair?.liquidity?.usd) return { depthSol: 0, depthGrowth: 0 };

  const liquidityUsd = solanaPair.liquidity.usd;
  const depthSol = liquidityUsd / solPrice / 2;
  const depthGrowth =
    baseline > 0 ? ((depthSol - baseline) / baseline) * 100 : 0;

  return { depthSol, depthGrowth };
}

/** Fees compounded (SOL) = sum of SOL sent from Bootstrap in ADD_LIQUIDITY txs. */
async function fetchFeesCompoundedFromHelius(
  bootstrapWallet: string,
  apiKey: string
): Promise<number> {
  if (!bootstrapWallet || !apiKey) return 0;

  const url = `https://api.helius.xyz/v0/addresses/${bootstrapWallet}/transactions?api-key=${apiKey}&type=ADD_LIQUIDITY&limit=100`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) return 0;

  const txs = (await res.json()) as Array<{
    nativeTransfers?: Array<{
      fromUserAccount?: string;
      toUserAccount?: string;
      amount: number;
    }>;
  }>;

  const bootstrapLower = bootstrapWallet.toLowerCase();
  let totalLamports = 0;

  for (const tx of txs) {
    const native = tx.nativeTransfers ?? [];
    for (const t of native) {
      if (t.fromUserAccount?.toLowerCase() === bootstrapLower && t.amount > 0) {
        totalLamports += t.amount;
      }
    }
  }

  return totalLamports / 1e9;
}

/** Compute health score (0–100). */
function computeHealthScore(opts: {
  depthSol: number;
  lpLocked: boolean;
  devSellPressure: "none" | "low" | "high";
  bootstrapActive: boolean;
  depthTrendUp: boolean;
}): number {
  let score = 0;
  if (opts.depthSol > 150) score += 25;
  else if (opts.depthSol > 100) score += 20;
  else if (opts.depthSol > 50) score += 15;
  else score += 5;
  if (opts.lpLocked) score += 20;
  if (opts.devSellPressure === "none") score += 20;
  else if (opts.devSellPressure === "low") score += 10;
  if (opts.bootstrapActive) score += 20;
  else score += 10;
  score += opts.depthTrendUp ? 15 : 10;
  return Math.min(100, score);
}

export async function GET() {
  let depthSol = 0;
  let depthGrowth = 0;
  let feesCompoundedSol = 0;

  const [depthResult, feesResult] = await Promise.allSettled([
    fetchDepthFromDexScreener(POOL_TOKEN_MINT),
    fetchFeesCompoundedFromHelius(BOOTSTRAP_WALLET, HELIUS_API_KEY),
  ]);

  if (depthResult.status === "fulfilled") {
    depthSol = depthResult.value.depthSol;
    depthGrowth = depthResult.value.depthGrowth;
  }
  if (feesResult.status === "fulfilled") {
    feesCompoundedSol = feesResult.value;
  }

  const healthScore = computeHealthScore({
    depthSol,
    lpLocked: true,
    devSellPressure: "none",
    bootstrapActive: true,
    depthTrendUp: depthGrowth >= 0,
  });

  return NextResponse.json({
    depth: depthSol,
    depthGrowth,
    feesCompounded: feesCompoundedSol,
    healthScore,
  });
}
