"use client";

import useSWR from "swr";
import { formatSol, formatPercent } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const statLabels: Record<string, string> = {
  depth: "Pool Depth",
  depthGrowth: "Depth Growth",
  healthScore: "Health Score",
};

export default function StatsBar() {
  const { data, isLoading } = useSWR("/api/pool-stats", fetcher, {
    refreshInterval: 30_000,
  });

  const stats = data
    ? [
        {
          label: statLabels.depth,
          value: `${formatSol(data.depth)} SOL`,
          isAccent: true,
        },
        {
          label: statLabels.depthGrowth,
          value: formatPercent(data.depthGrowth ?? 0),
          isAccent: true,
        },
        {
          label: statLabels.healthScore,
          value: `${data.healthScore ?? 0}/100`,
          isAccent: false,
        },
      ]
    : [
        { label: statLabels.depth, value: "—", isAccent: false },
        { label: statLabels.depthGrowth, value: "—", isAccent: false },
        { label: statLabels.healthScore, value: "—", isAccent: false },
      ];

  return (
    <section
      className="stats-bar relative z-[1]"
      style={{
        background: "#EEF6FF",
        borderTop: "1px solid rgba(0, 100, 200, 0.1)",
        borderBottom: "1px solid rgba(0, 100, 200, 0.1)",
        padding: "36px 40px",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-12">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p
              className="mb-1 font-medium uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "1.5px",
                color: "#888",
              }}
            >
              {s.label}
            </p>
            <p
              className="font-mono font-bold"
              style={{
                fontSize: "28px",
                letterSpacing: "-1px",
                color: s.isAccent ? "#0090FF" : "#171717",
              }}
            >
              {isLoading && !data ? "—" : s.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
