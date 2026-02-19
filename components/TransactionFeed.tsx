"use client";

import { useRef, useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import { SOLSCAN_TX_BASE } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type TxType = "BUYBACK" | "LP_ADD" | "FEE_IN";

const badgeStyle: Record<TxType, React.CSSProperties> = {
  BUYBACK: { background: "rgba(0, 200, 83, 0.1)", color: "#00C853" },
  LP_ADD: { background: "rgba(0, 144, 255, 0.1)", color: "#0090FF" },
  FEE_IN: { background: "rgba(255, 149, 0, 0.1)", color: "#FF9500" },
};

function formatAmount(amount: number): string {
  return amount >= 0.01 ? amount.toFixed(3) : "<0.01";
}

export default function TransactionFeed() {
  const { data: txs = [] } = useSWR<{ type: TxType; amount: number; hash: string; timestamp: string }[]>(
    "/api/transactions?limit=15",
    fetcher,
    { refreshInterval: 10_000 }
  );
  const prevFirstHash = useRef<string | null>(null);
  const [flashFirstHash, setFlashFirstHash] = useState<string | null>(null);

  useEffect(() => {
    if (txs.length > 0 && txs[0].hash !== prevFirstHash.current) {
      prevFirstHash.current = txs[0].hash;
      setFlashFirstHash(txs[0].hash);
      const t = setTimeout(() => setFlashFirstHash(null), 1000);
      return () => clearTimeout(t);
    }
  }, [txs]);

  return (
    <section id="live-feed" className="feed-section py-20 px-4 relative z-[1]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p
            className="font-mono font-bold uppercase"
            style={{ fontSize: "11px", letterSpacing: "2px", color: "#0090FF" }}
          >
            DEV WALLET ACTIVITY
          </p>
          <span
            className="font-mono font-semibold inline-flex items-center gap-2"
            style={{ color: "#00C853", fontSize: "12px" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
            LIVE
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Live feed</h2>

        <div className="space-y-3 max-h-[420px] overflow-y-auto">
          {txs.length === 0 ? (
            <div
              className="rounded-xl py-8 px-6 text-center text-gray-500 font-mono text-sm"
              style={{ border: "1.5px solid rgba(0, 100, 200, 0.1)", background: "rgba(255, 255, 255, 0.6)" }}
            >
              No transactions yet. Configure DEV_WALLET and HELIUS_API_KEY.
            </div>
          ) : (
            txs.map((tx, i) => (
              <div
                key={tx.hash}
                className={`rounded-xl flex flex-wrap items-center gap-3 sm:gap-4 animate-slide-in ${tx.hash === flashFirstHash ? "animate-flash-new" : ""}`}
                style={{
                  border: "1.5px solid rgba(0, 100, 200, 0.1)",
                  padding: "14px 18px",
                  background: "rgba(255, 255, 255, 0.6)",
                }}
              >
                <span
                  className="font-mono font-semibold text-xs px-2 py-0.5 rounded"
                  style={badgeStyle[tx.type]}
                >
                  {tx.type === "FEE_IN" ? "FEE IN" : tx.type === "LP_ADD" ? "LP ADD" : "BUYBACK"}
                </span>
                <span className="font-mono text-sm font-bold text-gray-900">
                  {formatAmount(tx.amount)} SOL
                </span>
                <Link
                  href={`${SOLSCAN_TX_BASE}/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs hover:underline truncate max-w-[140px] sm:max-w-none"
                  style={{ color: "#0090FF" }}
                >
                  {tx.hash.slice(0, 8)}…{tx.hash.slice(-8)}
                </Link>
                <span className="font-mono text-xs text-gray-500 ml-auto">
                  {timeAgo(new Date(tx.timestamp))}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
