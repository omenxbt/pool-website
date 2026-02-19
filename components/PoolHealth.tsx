"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const RADIUS = 58;
const STROKE = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PoolHealth() {
  const { data } = useSWR("/api/pool-stats", fetcher, { refreshInterval: 30_000 });
  const score = Math.min(100, Math.max(0, data?.healthScore ?? 0));
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  const depth = data?.depth ?? 0;
  const depthLabel = depth > 150 ? "Excellent" : depth > 100 ? "Good" : "Low";
  const depthTrend = data?.depthGrowth ?? 0;

  return (
    <section className="health-section py-20 px-4 relative z-[1]" style={{ background: "#E4F0FF" }}>
      <div className="max-w-6xl mx-auto">
        <p
          className="font-mono font-bold uppercase mb-2"
          style={{ fontSize: "11px", letterSpacing: "2px", color: "#0090FF" }}
        >
          Health Check
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          How healthy is the pool?
        </h2>

        <div
          className="flex flex-col md:flex-row items-center gap-12 rounded-2xl p-10 md:p-[40px]"
          style={{
            background: "rgba(255, 255, 255, 0.6)",
            border: "1.5px solid rgba(0, 100, 200, 0.1)",
          }}
        >
          <div className="relative flex-shrink-0">
            <svg width={132} height={132} className="transform -rotate-90">
              <circle
                cx={66}
                cy={66}
                r={RADIUS}
                fill="none"
                stroke="#f0f0f0"
                strokeWidth={STROKE}
              />
              <circle
                cx={66}
                cy={66}
                r={RADIUS}
                fill="none"
                stroke="#0090FF"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                className="transition-[stroke-dashoffset] duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-mono font-bold"
                style={{ fontSize: "36px", color: "#0090FF" }}
              >
                {score}
              </span>
              <span
                className="uppercase mt-1"
                style={{
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  color: "#888",
                }}
              >
                Score
              </span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div
              className="py-3 flex justify-between items-center"
              style={{ borderBottom: "1px solid rgba(0, 100, 200, 0.1)" }}
            >
              <span style={{ fontSize: "13px", color: "#666" }}>Liquidity Depth</span>
              <span className="font-mono font-bold text-[13px] text-[#00C853]">{depthLabel}</span>
            </div>
            <div
              className="py-3 flex justify-between items-center"
              style={{ borderBottom: "1px solid rgba(0, 100, 200, 0.1)" }}
            >
              <span style={{ fontSize: "13px", color: "#666" }}>LP Locked</span>
              <span className="font-mono font-bold text-[13px] text-[#00C853]">Yes</span>
            </div>
            <div
              className="py-3 flex justify-between items-center"
              style={{ borderBottom: "1px solid rgba(0, 100, 200, 0.1)" }}
            >
              <span style={{ fontSize: "13px", color: "#666" }}>Dev Sell Pressure</span>
              <span className="font-mono font-bold text-[13px] text-[#00C853]">None</span>
            </div>
            <div
              className="py-3 flex justify-between items-center"
              style={{ borderBottom: "1px solid rgba(0, 100, 200, 0.1)" }}
            >
              <span style={{ fontSize: "13px", color: "#666" }}>Fee Routing</span>
              <span className="font-mono font-bold text-[13px] text-[#00C853]">Active</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span style={{ fontSize: "13px", color: "#666" }}>Depth Trend</span>
              <span
                className="font-mono font-bold text-[13px]"
                style={{ color: depthTrend >= 0 ? "#00C853" : "#FF3D57" }}
              >
                {depthTrend >= 0 ? "+" : ""}{depthTrend.toFixed(1)}% (24h)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
