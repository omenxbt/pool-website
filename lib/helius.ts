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
  mint?: string;
  fromUserAccount?: string;
  toUserAccount?: string;
}

interface HeliusTransaction {
  signature: string;
  timestamp: string | number; // ISO string or Unix seconds
  type: string;
  nativeTransfers?: NativeTransfer[];
  tokenTransfers?: TokenTransfer[];
  source?: string;
  description?: string;
}

/**
 * Fetch enhanced transaction history for an address.
 * Classification order: LP_ADD first (so LP adds aren't swallowed by FEE_IN), then FEE_IN, BUYBACK, then LP_ADD fallback.
 */
export async function getEnhancedTransactions(
  address: string,
  limit = 25
): Promise<ParsedTransaction[]> {
  if (!HELIUS_API_KEY) {
    return [];
  }
  const url = `${HELIUS_BASE}/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) return [];
  const data = (await res.json()) as HeliusTransaction[];
  const addr = address.toLowerCase();
  const parsed: ParsedTransaction[] = [];

  const hasIncomingSol = (n: NativeTransfer[]) =>
    n.some((t) => t.toUserAccount?.toLowerCase() === addr && t.amount > 0);
  const hasOutgoingSol = (n: NativeTransfer[]) =>
    n.some((t) => t.fromUserAccount?.toLowerCase() === addr && t.amount > 0);
  const hasSolMovement = (n: NativeTransfer[]) => hasIncomingSol(n) || hasOutgoingSol(n);
  const incomingSolAmount = (n: NativeTransfer[]) => {
    const t = n.find((x) => x.toUserAccount?.toLowerCase() === addr && x.amount > 0);
    return t ? lamportsToSol(t.amount) : 0;
  };
  const outgoingSolAmount = (n: NativeTransfer[]) => {
    const t = n.find((x) => x.fromUserAccount?.toLowerCase() === addr && x.amount > 0);
    return t ? lamportsToSol(t.amount) : 0;
  };
  const addrInTokenTransfer = (tok: TokenTransfer[]) =>
    tok.some(
      (t) =>
        t.fromUserAccount?.toLowerCase() === addr || t.toUserAccount?.toLowerCase() === addr
    );

  for (const tx of data) {
    // Helius may return timestamp as Unix seconds (number); Date() expects ms for numbers
    const ts =
      typeof tx.timestamp === "number"
        ? new Date(tx.timestamp * 1000)
        : new Date(tx.timestamp);
    const native = tx.nativeTransfers ?? [];
    const token = tx.tokenTransfers ?? [];
    const desc = tx.description ?? "";
    const type = (tx.type ?? "").toUpperCase();
    const source = (tx.source ?? "").toUpperCase();

    // 1) LP_ADD first: type ADD_LIQUIDITY, or description match, or address sends SOL and receives token (so LP adds aren't swallowed by FEE_IN)
    const isLpType = type === "ADD_LIQUIDITY" || /add liquidity|liquidity|add.*liquidity/i.test(desc);
    const addressSentSolAndReceivedToken =
      hasOutgoingSol(native) && token.some((t) => t.toUserAccount?.toLowerCase() === addr);
    if (isLpType || addressSentSolAndReceivedToken) {
      const amount = outgoingSolAmount(native);
      if (amount > 0) {
        parsed.push({ type: "LP_ADD", amount, hash: tx.signature, timestamp: ts });
      }
      continue;
    }

    // 2) FEE_IN: any tx where the address receives incoming SOL (no LP_ADD already matched)
    if (hasIncomingSol(native)) {
      const amount = incomingSolAmount(native);
      if (amount > 0) {
        parsed.push({ type: "FEE_IN", amount, hash: tx.signature, timestamp: ts });
      }
      continue;
    }

    // 3) BUYBACK: type SWAP or description match, or Jupiter swap present, or SOL movement + token involvement
    const isSwapType = type === "SWAP" || /swap|buy|sell|trade|pump/i.test(desc);
    const isJupiterSwap = source === "JUPITER" || /jupiter/i.test(desc);
    const hasSolAndTokenMovement =
      hasSolMovement(native) && token.length > 0 && addrInTokenTransfer(token);
    if (isSwapType || isJupiterSwap || hasSolAndTokenMovement) {
      const solIn = native.find((t) => t.toUserAccount?.toLowerCase() === addr);
      const solOut = native.find((t) => t.fromUserAccount?.toLowerCase() === addr);
      const amount = solIn ? lamportsToSol(solIn.amount) : (solOut ? lamportsToSol(solOut.amount) : 0);
      if (amount > 0) {
        parsed.push({ type: "BUYBACK", amount, hash: tx.signature, timestamp: ts });
      }
      continue;
    }

    // 4) LP_ADD fallback: address sends SOL and wasn't already classified (catch-all for compounded SOL)
    if (hasOutgoingSol(native)) {
      const amount = outgoingSolAmount(native);
      if (amount > 0) {
        parsed.push({ type: "LP_ADD", amount, hash: tx.signature, timestamp: ts });
      }
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

/**
 * Sum of POOL tokens sent (sold) by a wallet — for dev wallet "tokens sold" metric.
 */
export async function getTokensSoldByWallet(
  wallet: string,
  poolMint: string,
  limit = 100
): Promise<number> {
  if (!HELIUS_API_KEY || !wallet || !poolMint) return 0;
  const url = `${HELIUS_BASE}/v0/addresses/${wallet}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return 0;
  const data = (await res.json()) as HeliusTransaction[];
  const walletLower = wallet.toLowerCase();
  const mintLower = poolMint.toLowerCase();
  let total = 0;
  for (const tx of data) {
    const token = tx.tokenTransfers ?? [];
    for (const t of token) {
      if (
        t.fromUserAccount?.toLowerCase() === walletLower &&
        t.mint?.toLowerCase() === mintLower &&
        (t.tokenAmount ?? 0) > 0
      ) {
        total += t.tokenAmount ?? 0;
      }
    }
  }
  return total;
}
