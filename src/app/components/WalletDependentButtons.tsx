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
          className="bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg w-40 font-medium text-white"
        >
          Buy Ticket
        </button>
      )}

      {isLotteryAuthority && !isFinished && (
        <button
          onClick={pickWinner}
          className="bg-green-600 hover:bg-green-700 py-2.5 rounded-lg w-40 font-medium text-white"
        >
          Pick Winner
        </button>
      )}

      {!canClaim && (
        <button
          onClick={claimPrize}
          className="bg-yellow-500 hover:bg-yellow-600 py-2.5 rounded-lg w-40 font-medium text-white"
        >
          Claim Prize
        </button>
      )}

      {!isFinished && (
        <button
          onClick={createLottery}
          className="bg-purple-600 hover:bg-purple-700 py-2.5 rounded-lg w-40 font-medium text-white"
        >
          Create Lottery
        </button>
      )}
    </>
  );
};

export default WalletDependentButtons;
