"use client";

import Link from "next/link";
import { POOL_TOKEN_MINT, BOOTSTRAP_INFO_URL } from "@/lib/constants";

const SOLSCAN_BASE = "https://solscan.io";

export default function Footer() {
  const tokenUrl = POOL_TOKEN_MINT ? `${SOLSCAN_BASE}/token/${POOL_TOKEN_MINT}` : SOLSCAN_BASE;
  return (
    <footer
      className="relative z-[1] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto"
      style={{
        fontSize: "12px",
        padding: "40px",
        borderTop: "1px solid rgba(0, 100, 200, 0.1)",
        color: "#666",
      }}
    >
      <p>
        $POOL{" "}
        <Link
          href={tokenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono hover:underline"
          style={{ color: "#0090FF" }}
        >
          View on Solscan
        </Link>
      </p>
      <p>
        <span style={{ color: "#888" }}>Built on </span>
        <Link
          href={BOOTSTRAP_INFO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:underline"
          style={{ color: "#171717" }}
        >
          Bootstrap
        </Link>
      </p>
    </footer>
  );
}
