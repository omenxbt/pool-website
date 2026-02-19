import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import HowItWorks from "@/components/HowItWorks";
import DepthChart from "@/components/DepthChart";
import TransactionFeed from "@/components/TransactionFeed";
import PoolHealth from "@/components/PoolHealth";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative z-[1]">
        <Hero />
        <StatsBar />
        <HowItWorks />
        <DepthChart />
        <TransactionFeed />
        <PoolHealth />
        <CTA />
      </main>
    </>
  );
}
