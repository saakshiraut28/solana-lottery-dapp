/** @format */

import React from "react";
import { useAppContext } from "../context/AppContextProvider";

const WalletDependentButtons: React.FC = () => {
  const {
    connected,
    isFinished,
    canClaim,
    claimPrize,
    buyTicket,
    isLotteryAuthority,
    pickWinner,
    createLottery,
  } = useAppContext();

  if (!connected) return null;

  return (
    <>
      {!isFinished && (
        <button
          onClick={buyTicket}
          className="w-40 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg"
        >
          Buy Ticket
        </button>
      )}

      {isLotteryAuthority && !isFinished && (
        <button
          onClick={pickWinner}
          className="w-40 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg"
        >
          Pick Winner
        </button>
      )}

      {!canClaim && (
        <button
          onClick={claimPrize}
          className="w-40 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 rounded-lg"
        >
          Claim Prize
        </button>
      )}

      {!isFinished && (
        <button
          onClick={createLottery}
          className="w-40 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg"
        >
          Create Lottery
        </button>
      )}
    </>
  );
};

export default WalletDependentButtons;
