/** @format */

import { PublicKey, Connection } from "@solana/web3.js";

// Mock wallet implementation
export const mockWallet = () => {
  return {};
}

// Function to shorten public keys
export const shortenPk = (pk: PublicKey | string, chars: number = 5): string => {
  const pkStr = typeof pk === "object" ? pk.toBase58() : pk;
  return `${pkStr.slice(0, chars)}...${pkStr.slice(chars)}`;
};

// Function to confirm a transaction
export const confirmTx = async (txHash: any, connection: Connection): Promise<void> => {
  const blockHashInfo = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: blockHashInfo.blockhash,
    lastValidBlockHeight: blockHashInfo.lastValidBlockHeight,
    signature: txHash,
  });
};
