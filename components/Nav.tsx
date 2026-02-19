"use client";

import Link from "next/link";

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#depth", label: "Depth" },
  { href: "#dev-wallet", label: "Dev Wallet" },
  { href: "#live-feed", label: "Live Feed" },
];

export default function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] border-b"
      style={{
        background: "rgba(238, 246, 255, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "rgba(0, 100, 200, 0.1)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="#" className="font-mono text-xl font-bold">
          <span style={{ color: "#0090FF" }}>$</span>POOL
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-[#0090FF] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
