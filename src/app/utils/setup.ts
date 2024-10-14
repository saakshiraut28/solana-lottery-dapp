import { AnchorProvider, BN, Idl, Program } from "@coral-xyz/anchor";
import { PublicKey, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { LotteryProgram } from "./../types/programs";

import IDL from "./idl.json";
import {
  LOTTERY_SEED,
  MASTER_SEED,
  PROGRAM_ID,
  TICKET_SEED,
} from "./constants";
import { LotteryAccount } from "../types/accounts";
import { AnchorWallet } from "@solana/wallet-adapter-react";

// How to fetch our Program
export const getProgram = (connection: Connection, wallet: AnchorWallet) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program<Idl>(IDL as unknown as Idl, PROGRAM_ID, provider);
  return program as LotteryProgram;
};

export const getMasterAddress = async () => {
  return (
    await PublicKey.findProgramAddress([Buffer.from(MASTER_SEED)], PROGRAM_ID)
  )[0];
};

export const getLotteryAddress = async (id: number | BN) => {
  return (
    await PublicKey.findProgramAddress(
      [Buffer.from(LOTTERY_SEED), new BN(id).toArrayLike(Buffer, "le", 4)],
      PROGRAM_ID
    )
  )[0];
};

export const getTicketAddress = async (lotteryPk: PublicKey, id: number | BN) => {
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from(TICKET_SEED),
        lotteryPk.toBuffer(),
        new BN(id).toArrayLike(Buffer, "le", 4),
      ],
      PROGRAM_ID
    )
  )[0];
};

// Return the lastTicket ID and multiply the ticket price and convert LAMPORTS PER SOL and convert it to String
export const getTotalPrize = (lottery: LotteryAccount) => {
  return new BN(lottery.lastTicketNumber)
    .mul(lottery.ticketPrice)
    .div(new BN(LAMPORTS_PER_SOL))
    .toString();
};