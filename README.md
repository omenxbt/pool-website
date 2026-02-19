# $POOL Website

Single-page site for **$POOL** — a Solana memecoin that uses [Bootstrap](https://bootstrap.fun) to route all creator fees back into the liquidity pool instead of extracting them. The site acts as a token landing page and live dashboard showing on-chain proof that Bootstrap is working.

## Stack

- **Next.js** (App Router), **Tailwind CSS**, **TypeScript**
- **Helius API** for Solana RPC and enhanced transaction history
- **SWR** for polling (stats/wallet every 30s, transaction feed every 10s)

## Setup

1. Install: `npm install`
2. Copy env: `cp .env.example .env.local`
3. Set in `.env.local`:
   - `POOL_TOKEN_MINT` — $POOL token mint address
   - `POOL_PUMPSWAP_POOL` — PumpSwap pool address (for depth / reserves)
   - `BOOTSTRAP_WALLET` — Bootstrap routing wallet (for live tx feed)
   - `DEV_WALLET` — Dev wallet (for transparency section)
   - `HELIUS_API_KEY` — Helius API key (RPC + enhanced txs)

4. Run: `npm run dev`

Without env vars, the site still runs with mock/placeholder data so you can develop and preview.

## Structure

- **Sections:** Nav, Hero, Stats Bar, How It Works, Depth Chart, Dev Wallet, Live Transaction Feed, Pool Health, CTA, Footer
- **API routes:** `GET /api/pool-stats`, `GET /api/transactions`, `GET /api/wallet`
- **Data:** All values are intended to come from on-chain/Helius; amounts from Helius are in lamports (converted to SOL with `1e9`).

## Depth chart

The “with Bootstrap” vs “without Bootstrap” comparison uses generated series for demo. For production you can store hourly snapshots of the pool’s SOL balance (e.g. in a JSON file or KV store) and feed that into the chart; model the “without” line from initial liquidity minus estimated fee extraction (e.g. from typical pump.fun creator behavior).

## Pool stats

`/api/pool-stats` reads the PumpSwap pool account via RPC. You may need to parse the pool account layout per PumpSwap’s SDK/docs to get exact SOL and token reserves; the current implementation uses account lamports as a proxy when the pool address is set.
