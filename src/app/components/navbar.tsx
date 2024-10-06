/** @format */

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navbar = () => {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="font-main text-3xl">
          Soltery | Win-Win for everyone! :)
        </div>
        <WalletMultiButton />
      </div>
    </>
  );
};

export default Navbar;
