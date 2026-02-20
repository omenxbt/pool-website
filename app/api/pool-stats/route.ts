import { NextResponse } from "next/server";
import {
  POOL_TOKEN_MINT,
  BOOTSTRAP_WALLET,
  INITIAL_GRADUATION_LIQUIDITY_SOL,
} from "@/lib/constants";
import { getEnhancedTransactions } from "@/lib/helius";

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

async function getFeesCompoundedSol(bootstrapWallet: string): Promise<number> {
  if (!bootstrapWallet) return 0;
  const txs = await getEnhancedTransactions(bootstrapWallet, 150);
  return txs
    .filter((t) => t.type === "FEE_IN" && t.amount >= 0.01)
    .reduce((sum, t) => sum + t.amount, 0);
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
    getFeesCompoundedSol(BOOTSTRAP_WALLET),
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
