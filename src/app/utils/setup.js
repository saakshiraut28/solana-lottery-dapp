/** @format */

import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import IDL from "./idl.json";
import { LOTTERY_SEED, MASTER_SEED, TICKET_SEED, ProgramId } from "./constants";

// how to fetch the program
export const getProgram = (connection, wallet) => {
  const porvider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(IDL, ProgramId, provider);
  return program;
};

export const getMasterAddress = async () => {
    return (
        await PublicKey.findProgramAddressSync([Buffer.from(MASTER_SEED)], ProgramId)[0];
    )
}

export const getLotteryAddress = async (id) => {
    return (
        await PublicKey.findProgramAddressSync([ Buffer.from(LOTTERY_SEED), new BN(id).toArrayLike(Buffer,"le",4)], ProgramId))[ 0 ];
    )
}

export const getTicketAddress = async (LotteryPk, id) => {
    return (
        await PublicKey.findProgramAddressSync(
            [
                Buffer.from(TICKET_SEED),
                LotteryPk.toBuffer(),
                new BN(id).toArrayLike(Buffer, "le", 4)
            ],
            ProgramId
        )[ 0 ];
    )
}

export const getTotalPrice = (Lottery) => {
    return new BN(Lottery.LastTicketId).mul(Lottery.ticketPrice).div(new BN(LAMPORTS_PER_SOL)).toString();
}