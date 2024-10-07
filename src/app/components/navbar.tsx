/** @format */

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navbar = () => {
  return (
    <>
      <div className="absolute top-0 flex items-center justify-between px-4 py-2 bg-white opacity-75">
        <div className="font-main text-3xl">
          Soltery | Win-Win for everyone! :)
        </div>
        <WalletMultiButton />
      </div>
    </>
  );
};

export default Navbar;
