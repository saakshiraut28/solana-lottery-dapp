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
      <div>
        <p>Lottery: {lotteryId}</p>
        {connected ? (
          <>
            <button onClick={initMaster}> Initialize Master</button>
          </>
        ) : (
          <>
            <WalletMultiButton />
          </>
        )}
      </div>
    );

  return (
    <div>
      <Navbar />
      <p>Lottery Id : {lotteryId}</p>
      <p>Lottery Pot: {lotteryPot}</p>
      {!isFinished ? <>Live</> : <>Closed</>}

      {!isFinished ? (
        <h5 className="text-center my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Lottery {lotteryId} is live, join now!
        </h5>
      ) : (
        <h5 className="text-center my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          WAIT TILL NEXT Lottery!
        </h5>
      )}

      <p>Other options</p>
      {connected ? (
        <>
          {!isFinished && (
            <div>
              <button
                onClick={buyTicket}
                type="button"
                className="w-40 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Enter
              </button>
            </div>
          )}

          {isLotteryAuthority && !isFinished && (
            <div>
              <button
                onClick={pickWinner}
                type="button"
                className="w-40 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Pick Winner
              </button>
            </div>
          )}

          {canClaim && (
            <div>
              <button
                onClick={claimPrize}
                type="button"
                className="w-40 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Claim prize
              </button>
            </div>
          )}

          <div>
            <button
              onClick={createLottery}
              type="button"
              className="w-40 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Create lottery
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-4 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <WalletMultiButton />
        </div>
      )}
    </div>
  );
}
