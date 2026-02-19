/**
 * Helius API helpers. All amounts from Helius are in lamports — convert with lamportsToSol.
 */

import { HELIUS_API_KEY } from "./constants";
import { lamportsToSol } from "./utils";

const HELIUS_BASE = "https://api.helius.xyz";

export type HeliusTxType = "BUYBACK" | "LP_ADD" | "FEE_IN";

export interface ParsedTransaction {
  type: HeliusTxType;
  amount: number; // SOL
  hash: string;
  timestamp: Date;
}

interface NativeTransfer {
  fromUserAccount?: string;
  toUserAccount?: string;
  amount: number;
}

interface TokenTransfer {
  tokenSymbol?: string;
  tokenAmount?: number;
  fromUserAccount?: string;
  toUserAccount?: string;
}

interface HeliusTransaction {
  signature: string;
  timestamp: string; // ISO
  type: string;
  nativeTransfers?: NativeTransfer[];
  tokenTransfers?: TokenTransfer[];
  source?: string;
  description?: string;
}

/**
 * Fetch enhanced transaction history for an address.
 * Filter and categorize: FEE IN (incoming SOL), BUYBACK (swap), LP ADD (add liquidity).
 */
export async function getEnhancedTransactions(
  address: string,
  limit = 25
): Promise<ParsedTransaction[]> {
  if (!HELIUS_API_KEY) {
    return [];
  }
  const url = `${HELIUS_BASE}/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = (await res.json()) as HeliusTransaction[];
  const bootstrap = address.toLowerCase();
  const parsed: ParsedTransaction[] = [];

  for (const tx of data) {
    const ts = new Date(tx.timestamp);
    const native = tx.nativeTransfers ?? [];
    const token = tx.tokenTransfers ?? [];

    // Incoming SOL to Bootstrap = creator fee routed in
    const incomingSol = native.find(
      (t) => t.toUserAccount?.toLowerCase() === bootstrap && t.amount > 0
    );
    if (incomingSol) {
      parsed.push({
        type: "FEE_IN",
        amount: lamportsToSol(incomingSol.amount),
        hash: tx.signature,
        timestamp: ts,
      });
      continue;
    }

    // Swap (Jupiter / PumpSwap) = buyback
    if (tx.type === "SWAP" || tx.source === "JUPITER" || tx.description?.toLowerCase().includes("swap")) {
      const solOut = native.find((t) => t.fromUserAccount?.toLowerCase() === bootstrap);
      const solIn = native.find((t) => t.toUserAccount?.toLowerCase() === bootstrap);
      const amount = solIn ? lamportsToSol(solIn.amount) : (solOut ? -lamportsToSol(solOut.amount) : 0);
      if (amount !== 0) {
        parsed.push({
          type: "BUYBACK",
          amount: Math.abs(amount),
          hash: tx.signature,
          timestamp: ts,
        });
      }
      continue;
    }

    // Add liquidity
    if (
      tx.type === "ADD_LIQUIDITY" ||
      tx.description?.toLowerCase().includes("add liquidity") ||
      (token.some((t) => t.toUserAccount?.toLowerCase() === bootstrap) && native.some((t) => t.fromUserAccount?.toLowerCase() === bootstrap))
    ) {
      const solUsed = native.find((t) => t.fromUserAccount?.toLowerCase() === bootstrap);
      parsed.push({
        type: "LP_ADD",
        amount: solUsed ? lamportsToSol(solUsed.amount) : 0,
        hash: tx.signature,
        timestamp: ts,
      });
    }
  }

  // Dedupe by hash (same tx can match multiple rules), keep first type we assigned
  const seen = new Set<string>();
  return parsed.filter((p) => {
    if (seen.has(p.hash)) return false;
    seen.add(p.hash);
    return true;
  });
}
