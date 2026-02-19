/**
 * On-chain addresses and config. Set via env vars in production.
 */
const env = process.env;

export const POOL_TOKEN_MINT = env.POOL_TOKEN_MINT ?? "";
export const POOL_PUMPSWAP_POOL = env.POOL_PUMPSWAP_POOL ?? "";
export const BOOTSTRAP_WALLET = env.BOOTSTRAP_WALLET ?? "";
export const DEV_WALLET = env.DEV_WALLET ?? "";
export const HELIUS_API_KEY = env.HELIUS_API_KEY ?? "";

/** Initial graduation liquidity (SOL) used for depth growth % */
export const INITIAL_GRADUATION_LIQUIDITY_SOL = 85;

/** Solscan base URL for tx links */
export const SOLSCAN_TX_BASE = "https://solscan.io/tx";

/** PumpSwap / Bootstrap links */
export const PUMPSWAP_URL = "https://pump.fun";
export const DEXSCREENER_URL = "https://dexscreener.com/solana";
export const BOOTSTRAP_INFO_URL = "https://bootstrap.fun"; // adjust if different
export const X_POOL_HANDLE = "https://x.com/pool_tokenxyz";
