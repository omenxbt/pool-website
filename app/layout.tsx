import type { Metadata } from "next";
import { Space_Mono, Sora } from "next/font/google";
import "./globals.css";
import Bubbles from "@/components/Bubbles";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "$POOL — The Pool Only Gets Deeper",
  description:
    "$POOL is liquidity that compounds. Every trade makes the pool thicker. No dev extraction. No draining. Just depth.",
  icons: {
    icon: [{ url: "/icon.png?v=2", type: "image/png" }, { url: "/icon.png?v=2", type: "image/png", sizes: "32x32" }],
    shortcut: "/icon.png?v=2",
    apple: "/icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/icon.png?v=2" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/icon.png?v=2" type="image/png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body
        className={`${sora.variable} ${spaceMono.variable} antialiased text-[var(--foreground)]`}
        style={{ fontFamily: "'Sora', sans-serif", backgroundColor: "#EEF6FF" }}
      >
        <Bubbles />
        {children}
      </body>
    </html>
  );
}
