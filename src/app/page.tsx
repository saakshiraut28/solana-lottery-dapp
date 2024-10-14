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
    // Ensure the component is mounted before rendering certain elements
    setIsMounted(true);
  }, []);

  if (!isInitialized) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center text-black font-main">
          <div className="border -mt-4 px-8 py-4 text-center bg-white opacity-75">
            <p className="text-xl font-semibold mb-4">
              Lottery ID: {lotteryId}
            </p>
            {connected ? (
              <div
                onClick={initMaster}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Initialize Master
              </div>
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
        <div className="flex flex-col items-center justify-center py-12  font-main">
          <div className="md:w-1/2 w-full border border-white rounded-lg p-6 bg-white opacity-75">
            <p className="text-lg mb-4">
              <span className="font-bold">Lottery ID:</span> {lotteryId}
            </p>
            <p className="text-lg mb-4">
              <span className="font-bold">Lottery Pot:</span> {lotteryPot}
            </p>

            {!isFinished ? (
              <h5 className="text-center my-4 text-3xl font-bold text-green-400">
                Lottery {lotteryId} is live, join now!
              </h5>
            ) : (
              <h5 className="text-center my-4 text-3xl font-bold text-red-500">
                Lottery Closed! Wait for the next one.
              </h5>
            )}

            <div className="mt-6 flex flex-col items-center space-y-4">
              {connected ? (
                <>
                  {!isFinished && (
                    <div
                      onClick={buyTicket}
                      className="w-40 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg"
                    >
                      Buy Ticket
                    </div>
                  )}

                  {isLotteryAuthority && !isFinished && (
                    <div
                      onClick={pickWinner}
                      className="w-40 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg"
                    >
                      Pick Winner
                    </div>
                  )}

                  {canClaim && (
                    <div
                      onClick={claimPrize}
                      className="w-40 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 rounded-lg"
                    >
                      Claim Prize
                    </div>
                  )}

                  <div
                    onClick={createLottery}
                    className="w-40 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg"
                  >
                    Create Lottery
                  </div>
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