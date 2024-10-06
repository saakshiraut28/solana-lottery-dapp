use anchor_lang::prelude::error_code;

#[error_code]
pub enum LotteryError {
    #[msg("Winner already exists.")]
    WinnerAlreadyExists,
    #[msg("No tickets left.")]
    NoTicketsLeft,
    #[msg("No one has bought your ticket. Winner cannot be announced yet.")]
    NoParticipants,
    #[msg("Winner has not been chosen.")]
    NoWinner,
    #[msg("Invalid Winner")]
    InvalidWinner,
    #[msg("The prize have been already claim")]
    LotteryClosed,
}
