"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** Chart: blue line 85→~172 SOL, red dashed 85→~52 SOL. Y: 45,90,135,180. X: 0h,1h,2h,4h,8h,12h,16h,24h */
const CHART_WIDTH = 520;
const CHART_HEIGHT = 240;
const PAD_LEFT = 44;
const PAD_RIGHT = 24;
const PAD_TOP = 20;
const PAD_BOTTOM = 36;
const PLOT_W = CHART_WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_H = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;

const Y_TICKS = [45, 90, 135, 180];
const X_HOURS = [0, 1, 2, 4, 8, 12, 16, 24];
const BLUE_POINTS = [85, 88, 92, 98, 105, 112, 120, 128, 136, 142, 148, 154, 160, 165, 168, 170, 171, 171.5, 172];
const RED_POINTS = [85, 82, 79, 75, 72, 69, 66, 63, 61, 59, 57, 55, 54, 53, 52.5, 52, 52, 52, 52];

function scaleY(sol: number): number {
  const min = 45;
  const max = 180;
  return PAD_TOP + PLOT_H - ((sol - min) / (max - min)) * PLOT_H;
}

function xForHour(h: number): number {
  return PAD_LEFT + (h / 24) * PLOT_W;
}

export default function DepthChart() {
  const { data } = useSWR("/api/pool-stats", fetcher, { refreshInterval: 30_000 });
  const pool24h = data?.depth ?? BLUE_POINTS[BLUE_POINTS.length - 1];
  const typical24h = RED_POINTS[RED_POINTS.length - 1];

  const bluePathD = BLUE_POINTS.map((v, i) => {
    const x = xForHour((i / (BLUE_POINTS.length - 1)) * 24);
    const y = scaleY(v);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(" ");

  const areaPathD =
    bluePathD +
    ` L ${xForHour(24)} ${scaleY(45)} L ${xForHour(0)} ${scaleY(45)} Z`;

  const redPathD = RED_POINTS.map((v, i) => {
    const x = xForHour((i / (RED_POINTS.length - 1)) * 24);
    const y = scaleY(v);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(" ");

  return (
    <section id="depth" className="depth-section py-20 px-4 relative z-[1]" style={{ background: "#E4F0FF" }}>
      <div className="max-w-6xl mx-auto">
        <p
          className="font-mono font-bold uppercase mb-2"
          style={{ fontSize: "11px", letterSpacing: "2px", color: "#0090FF" }}
        >
          Depth
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">$POOL vs everyone else</h2>

        <div
          className="rounded-2xl overflow-x-auto"
          style={{
            background: "rgba(255, 255, 255, 0.6)",
            border: "1.5px solid rgba(0, 100, 200, 0.1)",
            padding: "32px",
          }}
        >
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 mb-6 font-mono text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#0090FF]" />
              $POOL with Bootstrap
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#FF3D57]" />
              Average pump.fun token
            </span>
          </div>

          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full min-w-[320px] max-w-3xl mx-auto block"
            preserveAspectRatio="xMidYMid meet"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#0090FF" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0090FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Horizontal grid lines */}
            {Y_TICKS.map((tick) => (
              <line
                key={tick}
                x1={PAD_LEFT}
                y1={scaleY(tick)}
                x2={PAD_LEFT + PLOT_W}
                y2={scaleY(tick)}
                stroke="#f0f0f0"
                strokeWidth="1"
              />
            ))}
            {/* Y-axis labels */}
            {Y_TICKS.map((tick) => (
              <text
                key={tick}
                x={PAD_LEFT - 8}
                y={scaleY(tick) + 4}
                textAnchor="end"
                fontSize="11"
                fill="#666"
              >
                {tick}
              </text>
            ))}
            {/* X-axis labels */}
            {X_HOURS.map((h) => (
              <text
                key={h}
                x={xForHour(h)}
                y={CHART_HEIGHT - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#666"
              >
                {h}h
              </text>
            ))}
            {/* Blue area fill */}
            <path d={areaPathD} fill="url(#areaGradient)" />
            {/* Blue line */}
            <path
              d={bluePathD}
              fill="none"
              stroke="#0090FF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Blue dots on data points */}
            {BLUE_POINTS.map((v, i) => (
              <circle
                key={`b-${i}`}
                cx={xForHour((i / (BLUE_POINTS.length - 1)) * 24)}
                cy={scaleY(v)}
                r="5"
                fill="#0090FF"
              />
            ))}
            {/* Red dashed line */}
            <path
              d={redPathD}
              fill="none"
              stroke="#FF3D57"
              strokeWidth="2"
              strokeDasharray="8 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="grid grid-cols-2 gap-4 mt-8" style={{ gap: "16px" }}>
            <div
              className="rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                border: "1.5px solid rgba(0, 100, 200, 0.1)",
                padding: "24px",
              }}
            >
              <p
                className="uppercase mb-1"
                style={{ fontSize: "11px", color: "#888" }}
              >
                $POOL After 24h
              </p>
              <p
                className="font-mono font-bold"
                style={{ fontSize: "24px", color: "#00C853" }}
              >
                {typeof pool24h === "number" ? pool24h.toFixed(1) : pool24h} SOL
              </p>
              <p className="text-sm text-gray-500 font-normal mt-1" style={{ fontSize: "12px" }}>
                Liquidity compounds
              </p>
            </div>
            <div
              className="rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                border: "1.5px solid rgba(0, 100, 200, 0.1)",
                padding: "24px",
              }}
            >
              <p
                className="uppercase mb-1"
                style={{ fontSize: "11px", color: "#888" }}
              >
                Average pump.fun token
              </p>
              <p
                className="font-mono font-bold"
                style={{ fontSize: "24px", color: "#FF3D57" }}
              >
                {typical24h.toFixed(1)} SOL
              </p>
              <p className="text-sm text-gray-500 font-normal mt-1" style={{ fontSize: "12px" }}>
                Fees extracted. Liquidity gone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
