"use client";

import Link from "next/link";
import { PUMPSWAP_URL, BOOTSTRAP_INFO_URL } from "@/lib/constants";

export default function CTA() {
  return (
    <section className="cta-section py-20 px-4 relative z-[1]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Depth over everything.
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          $POOL uses Bootstrap to route every creator fee back into liquidity. No extraction. The pool only gets deeper.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={PUMPSWAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "#0090FF" }}
          >
            Buy $POOL
          </Link>
          <Link
            href={BOOTSTRAP_INFO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-[10px] font-semibold hover:bg-[#E8F4FF] transition-colors"
            style={{
              border: "1.5px solid rgba(0, 100, 200, 0.1)",
              background: "rgba(255, 255, 255, 0.6)",
              color: "#171717",
            }}
          >
            What is Bootstrap?
          </Link>
        </div>
      </div>
    </section>
  );
}
