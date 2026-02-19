import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { DEV_WALLET, HELIUS_API_KEY, POOL_TOKEN_MINT } from "@/lib/constants";
import { lamportsToSol } from "@/lib/utils";

const RPC = HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : "https://api.mainnet-beta.solana.com";

export async function GET() {
  if (!DEV_WALLET) {
    return NextResponse.json({
      holdings: 0,
      lpContributed: 0,
      tokensSold: 0,
    });
  }

  const connection = new Connection(RPC);
  const devPubkey = new PublicKey(DEV_WALLET);

  try {
    const [solBalance, tokenAccounts] = await Promise.all([
      connection.getBalance(devPubkey),
      connection.getParsedTokenAccountsByOwner(devPubkey, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }),
    ]);

    let poolTokenBalance = 0;
    let lpContributed = 0;

    for (const { account } of tokenAccounts.value) {
      const mint = account.data.parsed?.info?.mint;
      const amount = Number(account.data.parsed?.info?.tokenAmount?.uiAmount ?? 0);
      if (mint === POOL_TOKEN_MINT) {
        poolTokenBalance = amount;
      }
      // LP token detection: often has "LP" in symbol or specific mint; sum as proxy for LP contributed
      const symbol = account.data.parsed?.info?.tokenAmount?.symbol ?? "";
      if (symbol.includes("LP") || symbol.includes("pool")) {
        lpContributed += amount; // or derive from LP token value
      }
    }

    // Tokens sold: would require tx history; placeholder 0
    const tokensSold = 0;

    return NextResponse.json({
      holdings: poolTokenBalance,
      lpContributed,
      tokensSold,
      solBalance: lamportsToSol(solBalance),
    });
  } catch {
    return NextResponse.json({
      holdings: 0,
      lpContributed: 0,
      tokensSold: 0,
    });
  }
}
