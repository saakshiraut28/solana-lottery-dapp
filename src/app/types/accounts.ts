// src/types/accounts.ts
import { PublicKey } from "@solana/web3.js";

export interface LotteryAccount {
    id: number;
    authority: PublicKey;
    ticketPrice: bigint;
    lastTicketNumber: number;
    winnerId: number | null;
    claimed: boolean;
}

export interface MasterAccount {
    lastId: number;
}

export interface TicketAccount {
    id: number;
    authority: PublicKey;
    lotteryId: number;
}