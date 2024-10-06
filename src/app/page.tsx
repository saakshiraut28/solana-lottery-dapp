/** @format */
"use client";
import dynamic from "next/dynamic";
import Navbar from "./components/navbar";
import { useAppContext } from "./context/AppContextProvider";

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

  if (!isInitialized)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Lottery ID: {lotteryId}</p>
          {connected ? (
            <button
              onClick={initMaster}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Initialize Master
            </button>
          ) : (
            <WalletMultiButton />
          )}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-12">
        <div className="md:w-1/2 w-full bg-gray-800 border border-white rounded-lg p-6">
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

                {canClaim && (
                  <button
                    onClick={claimPrize}
                    className="w-40 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 rounded-lg"
                  >
                    Claim Prize
                  </button>
                )}

                <button
                  onClick={createLottery}
                  className="w-40 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg"
                >
                  Create Lottery
                </button>
              </>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
