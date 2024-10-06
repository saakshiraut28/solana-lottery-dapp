use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    clock::Clock, hash::hash, program::invoke, system_instruction::transfer,
};

mod constants;
mod error;

use crate::{constants::*, error::*};

declare_id!("5zu5FDmWzVxEtDcFefPGPrHVj363JWzLTghGD7mRRRTd");

#[program]
pub mod lottery_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn create_lottery(ctx: Context<CreateLottery>, ticket_price: u64) -> Result<()> {
        // initialize the account
        let lottery = &mut ctx.accounts.lottery;
        let master = &mut ctx.accounts.master;

        // increment last ticket id
        master.last_id += 1;

        // set lottery values
        lottery.id = master.last_id;
        lottery.authority = ctx.accounts.authority.key();
        lottery.ticket_price = ticket_price;

        msg!("Lottery {} Created Successfully!", lottery.id);
        msg!("Authority: {}", lottery.authority);
        msg!("Ticket Price: {}", lottery.ticket_price);

        Ok(())
    }

    pub fn buy_ticket(ctx: Context<BuyTicket>, lottery_id: u32) -> Result<()> {
        let lottery = &mut ctx.accounts.lottery;
        let ticket = &mut ctx.accounts.ticket;
        let buyer = &ctx.accounts.buyer;

        if lottery.winner_id.is_some() {
            return err!(LotteryError::WinnerAlreadyExists);
        }

        //Transfer sol to lottery account
        invoke(
            &transfer(&buyer.key(), &lottery.key(), lottery.ticket_price),
            &[
                buyer.to_account_info(),
                lottery.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        lottery.last_ticket_number += 1;

        ticket.id = lottery.last_ticket_number;
        ticket.lottery_id = lottery_id;
        ticket.authority = buyer.key();

        msg!("Ticket {} Purchase Successfully!", ticket.id);
        msg!("Ticket Authority: {}", ticket.authority);

        Ok(())
    }

    pub fn pick_winner(ctx: Context<PickWinner>, _lottery_id: u32) -> Result<()> {
        let lottery = &mut ctx.accounts.lottery;

        // Pick a random winner
        let clock = Clock::get()?;

        let timestamp_bytes = clock.unix_timestamp.to_le_bytes();
        let hash_result = hash(&timestamp_bytes);
        let first_8_bytes: [u8; 8] = hash_result.to_bytes()[..8]
            .try_into()
            .expect("Slice must be 8 bytes long");
        let hash_value = u64::from_le_bytes(first_8_bytes);
        let product = hash_value.wrapping_mul(clock.slot);
        let random_number = (product % u64::from(u32::MAX)) as u32;

        let winner_id = (random_number % lottery.last_ticket_number) + 1;

        lottery.winner_id = Some(winner_id);

        msg!("Winner id: {}", winner_id);

        Ok(())
    }

    pub fn claim_prize(ctx: Context<ClaimPrize>, _lottery_id: u32, _ticket_id: u32) -> Result<()> {
        let lottery = &mut ctx.accounts.lottery;

        if lottery.winner_id.is_some() {
            return err!(LotteryError::WinnerAlreadyExists);
        }

        if lottery.last_ticket_number == 0 {
            return err!(LotteryError::NoParticipants);
        }

        let ticket = &ctx.accounts.ticket;
        let winner = &ctx.accounts.authority;

        if lottery.claimed {
            return err!(LotteryError::LotteryClosed);
        }

        match lottery.winner_id {
            Some(winner_id) => {
                if winner_id != ticket.id {
                    return err!(LotteryError::InvalidWinner);
                }
            }
            None => return err!(LotteryError::NoWinner),
        }

        // Transfer prize from Lottery PDA to Winner
        let prize = lottery
            .ticket_price
            .checked_mul(lottery.last_ticket_number.into())
            .unwrap();

        **lottery.to_account_info().try_borrow_mut_lamports()? -= prize;

        **winner.to_account_info().try_borrow_mut_lamports()? += prize;

        lottery.claimed = true;

        msg!("Lottery is claimed by winner {}.", winner.key());

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 4 + 8 ,
        seeds = [MASTER_SEED.as_bytes()],
        bump,
    )]
    pub master: Account<'info, Master>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Master {
    pub last_id: u32,
}

#[derive(Accounts)]
pub struct CreateLottery<'info> {
    #[account(
        init,
        payer = authority,
        space = 4 + 32 + 4 + 1 + 8 + 4 + 1 + 8,
        seeds = [LOTTERY_SEED.as_bytes(), &(master.last_id +1).to_le_bytes()],
        bump,
    )]
    pub lottery: Account<'info, Lottery>,

    #[account(
        mut,
        seeds = [MASTER_SEED.as_bytes()],
        bump,
    )]
    pub master: Account<'info, Master>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Lottery {
    pub id: u32,
    pub authority: Pubkey,
    pub ticket_price: u64,
    pub last_ticket_number: u32,
    pub winner_id: Option<u32>,
    pub claimed: bool,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct BuyTicket<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
    )]
    pub lottery: Account<'info, Lottery>,

    #[account(
        init,
        payer = buyer,
        space = 4 + 4 +32 + 8,
        seeds = [TICKET_SEED.as_bytes(),lottery.key().as_ref(),&(lottery.last_ticket_number+1).to_le_bytes()],
        bump,
    )]
    pub ticket: Account<'info, Ticket>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Ticket {
    pub id: u32,
    pub authority: Pubkey,
    pub lottery_id: u32,
}

#[derive(Accounts)]
#[instruction(lottery_id:u32)]
pub struct PickWinner<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
        has_one = authority // coz only one person can pick lottery
    )]
    pub lottery: Account<'info, Lottery>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32, ticket_id: u32)]
pub struct ClaimPrize<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump
    )]
    pub lottery: Account<'info, Lottery>,

    #[account(
        seeds = [TICKET_SEED.as_bytes(),lottery.key().as_ref(),&(lottery.last_ticket_number+1).to_le_bytes()],
        bump,
        has_one = authority
    )]
    pub ticket: Account<'info, Ticket>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
