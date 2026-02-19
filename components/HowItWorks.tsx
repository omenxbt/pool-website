"use client";

const steps = [
  {
    title: "You Trade",
    description: "Every $POOL swap generates fees in SOL",
    icon: "🔄",
  },
  {
    title: "Fees Get Rerouted",
    description: "Instead of going to a dev wallet, fees flow back to the pool",
    icon: "↪️",
  },
  {
    title: "Tokens Get Bought",
    description: "SOL is used to buy $POOL off the market automatically",
    icon: "📈",
  },
  {
    title: "Pool Gets Deeper",
    description: "Bought tokens and SOL get added as liquidity. The pool is now thicker.",
    icon: "💧",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-section py-20 px-4 relative z-[1]">
      <div className="max-w-6xl mx-auto">
        <p
          className="font-mono font-bold uppercase mb-2"
          style={{ fontSize: "11px", letterSpacing: "2px", color: "#0090FF" }}
        >
          The Mechanics
        </p>
        <h2
          className="font-bold text-gray-900 mb-14"
          style={{ fontSize: "clamp(24px, 3.5vw, 36px)", letterSpacing: "-1px" }}
        >
          Every trade fills the pool
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-2">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col md:flex-row md:items-stretch">
              <div
                className="flex-1 rounded-2xl transition-all duration-200 hover:border-[#0090FF] hover:bg-[#E8F4FF] hover:-translate-y-1"
                style={{
                  border: "1.5px solid rgba(0, 100, 200, 0.1)",
                  padding: "32px 20px",
                  background: "rgba(255, 255, 255, 0.6)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-[14px] bg-[#E8F4FF] flex items-center justify-center text-2xl mb-4"
                >
                  {step.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-6 flex-shrink-0">
                  <span style={{ color: "#bbb", fontSize: "1.25rem" }}>→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
