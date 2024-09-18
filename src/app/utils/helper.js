/** @format */

export const mockWallet = () => {
  return {};
};

export const shortenPk = (pk, chars = 5) => {
  const pkStr = typeof pk === "object" ? pk.toBase58() : pk;
  return `${pkStr.slice(0, chars)}...${pkStr.slice(chars)}`;
};

export const confirmTx = async (txHash, connection) => {
  const blockHashInfo = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: blockHashInfo.blockhash,
    LastValidBlockHeight: blockHashInfo.LastValidBlockHeight,
    signature: txHash,
  });
};
