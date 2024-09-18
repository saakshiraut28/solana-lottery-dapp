/** @format */

import React, { createContext, ReactNode, FC } from "react";
import { BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import {
  getLotteryAddress,
  getMasterAddress,
  getProgram,
  getTicketAddress,
  getTotalPrice,
} from "../utils/setup";

// Define a type for the context value
interface AppContextType {
  someState: string; // Example state
  setSomeState: (value: string) => void; // Example function to update state
}

// Create a default value
const defaultContextValue: AppContextType = {
  someState: "",
  setSomeState: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContextValue);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: FC<AppContextProviderProps> = ({
  children,
}) => {
  const [someState, setSomeState] = React.useState<string>("");

  return (
    <AppContext.Provider value={{ someState, setSomeState }}>
      {children}
    </AppContext.Provider>
  );
};
