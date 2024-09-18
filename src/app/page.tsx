/** @format */

"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  const initializeMaster = () => {
    console.log("Master");
  };
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col space-y-2 w-fit bg-black">
        <WalletMultiButton style={{}} />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={initializeMaster}
        >
          Initialize Master
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded">
          Get Ticket
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded">
          Claim Prize
        </button>
        <button className="bg-red-500 text-white py-2 px-4 rounded">
          End Lottery
        </button>
      </div>
    </main>
  );
}
