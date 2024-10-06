/** @format */
"use client";
import React, {
  createContext,
  ReactNode,
  FC,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  getLotteryAddress,
  getMasterAddress,
  getProgram,
  getTicketAddress,
  getTotalPrize,
} from "../utils/setup";
import { BN } from "@coral-xyz/anchor";
import { LotteryProgram } from "../utils/LotteryProgramType";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58"; // Make sure bs58 is imported for encoding
import { confirmTx } from "../utils/helper";

interface AppContextType {
  connected: boolean;
  isInitialized: boolean;
  program: LotteryProgram | SystemProgram | null;
  masterAddress: PublicKey | null;
  initMaster: () => Promise<void>;
  createLottery: () => Promise<void>;
  lotteryId: number;
  lotteryAddress: PublicKey | null;
  lotteryPot: number | null;
  isLotteryAuthority: boolean;
  buyTicket: () => Promise<void>;
  pickWinner: () => Promise<void>;
  isFinished: boolean;
  canClaim: boolean;
  claimPrize: () => Promise<void>;
}

const defaultContextValue: AppContextType = {
  connected: false,
  isInitialized: false,
  program: null,
  masterAddress: null,
  initMaster: async () => {},
  createLottery: async () => {},
  lotteryId: 0,
  lotteryAddress: null,
  lotteryPot: null,
  isLotteryAuthority: false,
  buyTicket: async () => {},
  pickWinner: async () => {},
  isFinished: false,
  canClaim: false,
  claimPrize: async () => {},
};

export const AppContext = createContext<AppContextType>(defaultContextValue);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: FC<AppContextProviderProps> = ({
  children,
}) => {
  const [masterAddress, setMasterAddress] = useState<PublicKey | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [lotteryId, setLotteryId] = useState<number>(0);
  const [lotteryPot, setLotteryPot] = useState<number | null>(null);
  const [lottery, setLottery] = useState<any>(null); // You should replace 'any' with the appropriate lottery type
  const [lotteryAddress, setLotteryAddress] = useState<PublicKey | null>(null);
  const [winnerId, setWinnerId] = useState<number | null>(null);

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (connection && wallet) {
      return getProgram(connection, wallet);
    }
    return null;
  }, [connection, wallet]);

  useEffect(() => {
    if (program) {
      updateState();
    }
  }, [program]);

  useEffect(() => {
    if (lottery) {
      getPot();
      // Other functions like getPlayers or getHistory can be added similarly
    }
  }, [lottery]);

  const updateState = async () => {
    if (!program || !wallet?.publicKey) return;
    try {
      if (!masterAddress) {
        const masterAdd = await getMasterAddress();
        setMasterAddress(masterAdd);
        console.log("Master Address:", masterAdd.toString());
      }

      const masterAccountAddress = masterAddress ?? (await getMasterAddress());
      const master = await program.account.master.fetch(masterAccountAddress);

      if (master !== null) {
        setIsInitialized(true);
        setLotteryId(master.lastId);
        const lotteryAddress = await getLotteryAddress(master.lastId);
        setLotteryAddress(lotteryAddress);
        const lottery = await program.account.lottery.fetch(lotteryAddress);
        setLottery(lottery);
        console.log("Master account initialized");

        // Get user's tickets for current lottery
        const userTickets = await connection.getProgramAccounts(
          program.programId,
          {
            filters: [
              {
                memcmp: {
                  offset: 12,
                  bytes: bs58.encode(
                    new BN(lotteryId).toArrayLike(Buffer, "le", 4)
                  ),
                },
              },
              {
                memcmp: {
                  offset: 16,
                  bytes: wallet.publicKey.toBase58(),
                },
              },
            ],
          }
        );

        const userWin = userTickets.some((t: any) => {
          return t.account.id === lottery.winnerId;
        });

        if (userWin) {
          setWinnerId(lottery.winnerId);
        } else {
          setWinnerId(null);
        }
      }
    } catch (err) {
      console.error("Error updating state:", err);
      setIsInitialized(false);
    }
  };

  const getPot = async () => {
    const pot = getTotalPrize(lottery);
    setLotteryPot(Number(pot));
  };

  const initMaster = async () => {
    try {
      if (!masterAddress || !wallet?.publicKey) {
        console.log("Master address or wallet public key is missing");
        return;
      }
      const txHash = await program?.methods
        .initialize()
        .accounts({
          master: masterAddress,
          payer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      await confirmTx(txHash, connection);

      updateState();
    } catch (err) {
      console.log(err);
      console.log("There was an error initializing master.");
    }
  };

  const createLottery = async () => {
    try {
      const lotteryAddress = await getLotteryAddress(lotteryId + 1);
      if (!lotteryAddress || !wallet?.publicKey) {
        console.log("Missing lotteryAddress or wallet public key");
        return;
      }
      if (masterAddress) {
        const txHash = await program?.methods
          .createLottery(new BN(1).mul(new BN(LAMPORTS_PER_SOL)))
          .accounts({
            lottery: lotteryAddress,
            master: masterAddress,
            payer: wallet?.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        await confirmTx(txHash, connection);
      }

      updateState();
      console.log("Lottery Created");
    } catch (error) {
      console.log("There was an error creating the lottery:", error);
    }
  };

  const buyTicket = async () => {
    try {
      if (!lotteryAddress || !wallet?.publicKey) {
        console.log("Missing lotteryAddress or wallet public key");
        return;
      }
      const txHash = await program?.methods
        .buyTicket(lotteryId)
        .accounts({
          lottery: lotteryAddress,
          ticket: await getTicketAddress(
            lotteryAddress,
            lottery.lastTicketId + 1
          ),
          buyer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      await confirmTx(txHash, connection);
      updateState();
    } catch (err) {
      console.log("Error buying ticket:", err);
    }
  };

  const pickWinner = async () => {
    try {
      if (!lotteryAddress || !wallet?.publicKey) {
        console.log("Missing lotteryAddress or wallet public key");
        return;
      }
      const txHash = await program?.methods
        .pickWinner(lotteryId)
        .accounts({
          lottery: lotteryAddress,
          authority: wallet.publicKey,
        })
        .rpc();
      await confirmTx(txHash, connection);
      updateState();
    } catch (err) {
      console.log("Error picking winner:", err);
    }
  };

  const claimPrize = async () => {
    if (!lotteryAddress || !wallet?.publicKey) {
      console.log("Missing lotteryAddress or wallet public key");
      return;
    }
    try {
      const txHash = await program?.methods
        .claimPrize(lotteryId)
        .accounts({
          lottery: lotteryAddress,
          ticket: await getTicketAddress(lotteryAddress, winnerId),
          authority: wallet?.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      await confirmTx(txHash, connection);
      updateState();
      console.log("Prize claimed ");
    } catch (err) {
      console.log("Hum : Claim prize error in it");
    }
  };

  return (
    <AppContext.Provider
      value={{
        connected: wallet?.publicKey ? true : false,
        isInitialized,
        program,
        masterAddress,
        initMaster,
        createLottery,
        lotteryId,
        lotteryAddress,
        lotteryPot,
        isLotteryAuthority:
          wallet && lottery && wallet.publicKey.equals(lottery.authority),
        buyTicket,
        pickWinner,
        isFinished: lottery && lottery.winnerId,
        canClaim: lottery && !lottery.claimed && winnerId,
        claimPrize,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
