export default function Bubbles() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className={`pool-bubble pool-bubble-${i + 1}`} />
      ))}

      <style>{`
        .pool-bubble {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 0.15) 50%,
            rgba(0, 144, 255, 0.05) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.35);
          animation: bubbleRise linear infinite;
          opacity: 0;
        }

        @keyframes bubbleRise {
          0% {
            transform: translateX(0) scale(1);
            opacity: 0;
            bottom: -20px;
          }
          10% {
            opacity: 0.5;
          }
          85% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(var(--drift)) scale(var(--end-scale));
            opacity: 0;
            bottom: 110vh;
          }
        }

        .pool-bubble-1  { left: 5%;  width: 8px;  height: 8px;  animation-duration: 14s; animation-delay: 0s;   --drift: 30px;  --end-scale: 0.8; }
        .pool-bubble-2  { left: 15%; width: 14px; height: 14px; animation-duration: 18s; animation-delay: 2s;   --drift: -20px; --end-scale: 1.1; }
        .pool-bubble-3  { left: 25%; width: 6px;  height: 6px;  animation-duration: 12s; animation-delay: 4s;   --drift: 15px;  --end-scale: 0.6; }
        .pool-bubble-4  { left: 35%; width: 18px; height: 18px; animation-duration: 22s; animation-delay: 1s;   --drift: -40px; --end-scale: 1.2; }
        .pool-bubble-5  { left: 45%; width: 10px; height: 10px; animation-duration: 16s; animation-delay: 6s;   --drift: 25px;  --end-scale: 0.9; }
        .pool-bubble-6  { left: 55%; width: 12px; height: 12px; animation-duration: 20s; animation-delay: 3s;   --drift: -15px; --end-scale: 1.0; }
        .pool-bubble-7  { left: 65%; width: 7px;  height: 7px;  animation-duration: 13s; animation-delay: 8s;   --drift: 35px;  --end-scale: 0.7; }
        .pool-bubble-8  { left: 75%; width: 16px; height: 16px; animation-duration: 19s; animation-delay: 5s;   --drift: -25px; --end-scale: 1.15; }
        .pool-bubble-9  { left: 85%; width: 9px;  height: 9px;  animation-duration: 15s; animation-delay: 7s;   --drift: 20px;  --end-scale: 0.85; }
        .pool-bubble-10 { left: 92%; width: 11px; height: 11px; animation-duration: 17s; animation-delay: 0.5s; --drift: -30px; --end-scale: 1.05; }
        .pool-bubble-11 { left: 10%; width: 5px;  height: 5px;  animation-duration: 11s; animation-delay: 9s;   --drift: 10px;  --end-scale: 0.5; }
        .pool-bubble-12 { left: 40%; width: 20px; height: 20px; animation-duration: 24s; animation-delay: 3.5s; --drift: -35px; --end-scale: 1.3; }
        .pool-bubble-13 { left: 60%; width: 6px;  height: 6px;  animation-duration: 10s; animation-delay: 11s;  --drift: 18px;  --end-scale: 0.65; }
        .pool-bubble-14 { left: 30%; width: 13px; height: 13px; animation-duration: 21s; animation-delay: 1.5s; --drift: -12px; --end-scale: 1.08; }
        .pool-bubble-15 { left: 80%; width: 8px;  height: 8px;  animation-duration: 14s; animation-delay: 6.5s; --drift: 22px;  --end-scale: 0.75; }
      `}</style>
    </div>
  );
}
