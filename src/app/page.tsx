/** @format */

"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/navbar";
import { useAppContext } from "./context/AppContextProvider";
import { useEffect, useState } from "react";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function Home() {
  const {
    connected,
    isInitialized,
    initMaster,
    createLottery,
    lotteryId,
    lotteryPot,
    isLotteryAuthority,
    buyTicket,
    pickWinner,
    isFinished,
    canClaim,
    claimPrize,
  } = useAppContext();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isInitialized) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen font-main text-black">
          <div className="bg-white opacity-75 -mt-4 px-8 py-4 border text-center">
            <p className="mb-4 font-semibold text-xl">
              Lottery ID: {lotteryId}
            </p>
            {connected ? (
              <button
                onClick={initMaster}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium text-white"
              >
                Initialize Master
              </button>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <>
        <div className="flex flex-col justify-center items-center py-12 font-main">
          <div className="border-white bg-white opacity-75 p-6 border rounded-lg w-full md:w-1/2">
            <p className="mb-4 text-lg">
              <span className="font-bold">Lottery ID:</span> {lotteryId}
            </p>
            <p className="mb-4 text-lg">
              <span className="font-bold">Lottery Pot:</span> {lotteryPot}
            </p>

            {!isFinished ? (
              <h5 className="my-4 font-bold text-3xl text-center text-green-400">
                Lottery {lotteryId} is live, join now!
              </h5>
            ) : (
              <h5 className="my-4 font-bold text-3xl text-center text-red-500">
                Lottery Closed! Wait for the next one.
              </h5>
            )}

            <div className="flex flex-col items-center space-y-4 mt-6">
              {connected ? (
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

                  {canClaim && (
                    <button
                      onClick={claimPrize}
                      className="bg-yellow-500 hover:bg-yellow-600 py-2.5 rounded-lg w-40 font-medium text-white"
                    >
                      Claim Prize
                    </button>
                  )}

                  <button
                    onClick={createLottery}
                    className="bg-purple-600 hover:bg-purple-700 py-2.5 rounded-lg w-40 font-medium text-white"
                  >
                    Create Lottery
                  </button>
                </>
              ) : (
                isMounted && <WalletMultiButton />
              )}
            </div>
          </div>
        </div>
      </>
    </>
  );
}