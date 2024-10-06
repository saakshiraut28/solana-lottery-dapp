import { Program, Idl } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { LotteryAccount, MasterAccount, TicketAccount } from "./accounts";

// Define a separate helper for the methods
export interface LotteryProgramMethodsHelper {
    buyTicket: (lotteryId: number) => Promise<string>;
    claimPrize: (lotteryId: number, ticketId: number) => Promise<string>;
    createLottery: (ticketPrice: bigint) => Promise<string>;
    initialize: () => Promise<string>;
    pickWinner: (lotteryId: number) => Promise<string>;
    signature: () => Promise<string>;
}

// Keep the accounts interface as-is
export interface LotteryProgramAccounts {
    lottery: {
        fetch: (address: PublicKey) => Promise<LotteryAccount>;
    };
    master: {
        fetch: (address: PublicKey) => Promise<MasterAccount>;
    };
    ticket: {
        fetch: (address: PublicKey) => Promise<TicketAccount>;
    };
}

// Extend Program<Idl> without modifying methods
export interface LotteryProgram extends Program<Idl> {
    account: LotteryProgramAccounts;
    customMethods: LotteryProgramMethodsHelper;  // Add custom methods under a different property
}
