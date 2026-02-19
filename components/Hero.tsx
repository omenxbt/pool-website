"use client";

import Link from "next/link";
import { PUMPSWAP_URL, DEXSCREENER_URL, X_POOL_HANDLE } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="hero relative z-[1] pt-28 pb-20 px-4 flex flex-col items-center text-center">
      {/* Pool visual: 3 concentric pulsing rings, gradient circle, water fill, emoji */}
      <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
        {/* 3 pulsing rings */}
        <div className="absolute inset-0 rounded-full border-2 border-[#0090FF]/25 animate-ring-pulse" />
        <div className="absolute inset-5 rounded-full border-2 border-[#0090FF]/40 animate-ring-pulse" style={{ animationDelay: "0.4s" }} />
        <div className="absolute inset-10 rounded-full border-2 border-[#0090FF]/50 animate-ring-pulse" style={{ animationDelay: "0.8s" }} />
        {/* Main circle: gradient bg, water fill, box shadow */}
        <div
          className="pool-circle relative w-32 h-32 rounded-full overflow-hidden animate-pool-float"
          style={{
            background: "linear-gradient(145deg, #F4F9FF, #D6EBFF)",
            boxShadow: "0 20px 60px -15px rgba(0, 100, 200, 0.25)",
          }}
        >
          {/* Water fill ~55% from bottom with blue gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 animate-water-fill"
            style={{
              height: "55%",
              background: "linear-gradient(180deg, rgba(0, 144, 255, 0.35) 0%, rgba(0, 144, 255, 0.5) 100%)",
            }}
          />
          {/* Emoji 72px, above water, drop shadow */}
          <span
            className="absolute inset-0 flex items-center justify-center text-[72px] leading-none"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
          >
            🏊
          </span>
        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 max-w-2xl mb-4">
        The Pool Only Gets Deeper
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-10">
        <span className="font-mono text-[#0090FF] font-semibold">$POOL</span> is liquidity that compounds. Every trade makes the pool thicker. No dev extraction. No draining. Just depth.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href={PUMPSWAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] bg-[#0090FF] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Buy on PumpSwap
        </Link>
        <Link
          href={DEXSCREENER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] border-[1.5px] font-semibold hover:border-[#0090FF] hover:bg-[#E8F4FF] transition-colors"
          style={{ borderColor: "rgba(0, 100, 200, 0.1)", background: "rgba(255, 255, 255, 0.6)" }}
        >
          View on DexScreener
        </Link>
        <Link
          href={X_POOL_HANDLE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] border-[1.5px] font-semibold hover:border-[#0090FF] hover:bg-[#E8F4FF] transition-colors"
          style={{ borderColor: "rgba(0, 100, 200, 0.1)", background: "rgba(255, 255, 255, 0.6)" }}
        >
          @pool_tokenxyz
        </Link>
      </div>
    </section>
  );
}
