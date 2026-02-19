"use client";

import { useState } from "react";
import useSWR from "swr";
import { truncateAddress } from "@/lib/utils";
import { DEV_WALLET } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DevWallet() {
  const [copied, setCopied] = useState(false);
  const { data } = useSWR(DEV_WALLET ? "/api/wallet" : null, fetcher, { refreshInterval: 30_000 });

  const address = DEV_WALLET || "Configure DEV_WALLET";
  const copy = () => {
    if (!DEV_WALLET) return;
    navigator.clipboard.writeText(DEV_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="dev-wallet"
      className="wallet-section py-20 px-4 relative z-[1]"
      style={{
        background: "#E4F0FF",
        borderTop: "1px solid rgba(0, 100, 200, 0.1)",
        borderBottom: "1px solid rgba(0, 100, 200, 0.1)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <p
          className="font-mono font-bold uppercase mb-2"
          style={{ fontSize: "11px", letterSpacing: "2px", color: "#0090FF" }}
        >
          The Dev Wallet
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Everything on chain. Nothing hidden.
        </h2>

        <div className="space-y-6">
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl py-4 px-5"
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              border: "1.5px solid rgba(0, 100, 200, 0.1)",
            }}
          >
            <code className="font-mono text-sm text-gray-800 break-all">
              {truncateAddress(address, 8)}
            </code>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copy}
                disabled={!DEV_WALLET}
                className="text-sm font-medium hover:opacity-80 disabled:opacity-50"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <span
                className="font-mono font-bold rounded-full"
                style={{
                  fontSize: "10px",
                  padding: "4px 10px",
                  background: "rgba(0, 200, 83, 0.1)",
                  color: "#00C853",
                }}
              >
                LP LOCKED
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                border: "1.5px solid rgba(0, 100, 200, 0.1)",
              }}
            >
              <p
                className="uppercase mb-2"
                style={{ fontSize: "11px", letterSpacing: "1px", color: "#888" }}
              >
                Holdings
              </p>
              <p className="font-mono font-bold" style={{ fontSize: "20px" }}>
                {data?.holdings != null ? `${Number(data.holdings).toFixed(2)}% of supply` : "—"}
              </p>
            </div>
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                border: "1.5px solid rgba(0, 100, 200, 0.1)",
              }}
            >
              <p
                className="uppercase mb-2"
                style={{ fontSize: "11px", letterSpacing: "1px", color: "#888" }}
              >
                LP Contributed
              </p>
              <p className="font-mono font-bold" style={{ fontSize: "20px" }}>
                {data?.lpContributed != null ? `${Number(data.lpContributed).toFixed(2)} SOL` : "—"}
              </p>
            </div>
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                border: "1.5px solid rgba(0, 100, 200, 0.1)",
              }}
            >
              <p
                className="uppercase mb-2"
                style={{ fontSize: "11px", letterSpacing: "1px", color: "#888" }}
              >
                Tokens Sold
              </p>
              <p className="font-mono font-bold" style={{ fontSize: "20px" }}>
                {data?.tokensSold != null ? String(data.tokensSold) : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
