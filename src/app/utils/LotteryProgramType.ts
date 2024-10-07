/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lottery_program.json`.
 */


export type LotteryProgram = {
    "address": "5kBJdFooGFeNmfaLRm4Xx9Q8E68JFk2Ygh6Vd7QiL4pS",
    "metadata": {
        "name": "lotteryProgram",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "buyTicket",
            "discriminator": [
                11,
                24,
                17,
                193,
                168,
                116,
                164,
                169
            ],
            "accounts": [
                {
                    "name": "lottery",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    108,
                                    111,
                                    116,
                                    116,
                                    101,
                                    114,
                                    121
                                ]
                            },
                            {
                                "kind": "arg",
                                "path": "lotteryId"
                            }
                        ]
                    }
                },
                {
                    "name": "ticket",
                    "writable": true
                },
                {
                    "name": "buyer",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "lotteryId",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "claimPrize",
            "discriminator": [
                157,
                233,
                139,
                121,
                246,
                62,
                234,
                235
            ],
            "accounts": [
                {
                    "name": "lottery",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    108,
                                    111,
                                    116,
                                    116,
                                    101,
                                    114,
                                    121
                                ]
                            },
                            {
                                "kind": "arg",
                                "path": "lotteryId"
                            }
                        ]
                    }
                },
                {
                    "name": "ticket"
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true,
                    "relations": [
                        "ticket"
                    ]
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "lotteryId",
                    "type": "u32"
                },
                {
                    "name": "ticketId",
                    "type": "u32"
                }
            ]
        },
        {
            "name": "createLottery",
            "discriminator": [
                242,
                165,
                247,
                119,
                17,
                203,
                21,
                42
            ],
            "accounts": [
                {
                    "name": "lottery",
                    "writable": true
                },
                {
                    "name": "master",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    109,
                                    97,
                                    115,
                                    116,
                                    101,
                                    114
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "ticketPrice",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "initialize",
            "discriminator": [
                175,
                175,
                109,
                31,
                13,
                152,
                155,
                237
            ],
            "accounts": [
                {
                    "name": "master",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    109,
                                    97,
                                    115,
                                    116,
                                    101,
                                    114
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "payer",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "pickWinner",
            "discriminator": [
                227,
                62,
                25,
                73,
                132,
                106,
                68,
                96
            ],
            "accounts": [
                {
                    "name": "lottery",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    108,
                                    111,
                                    116,
                                    116,
                                    101,
                                    114,
                                    121
                                ]
                            },
                            {
                                "kind": "arg",
                                "path": "lotteryId"
                            }
                        ]
                    }
                },
                {
                    "name": "authority",
                    "signer": true,
                    "relations": [
                        "lottery"
                    ]
                }
            ],
            "args": [
                {
                    "name": "lotteryId",
                    "type": "u32"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "lottery",
            "discriminator": [
                162,
                182,
                26,
                12,
                164,
                214,
                112,
                3
            ]
        },
        {
            "name": "master",
            "discriminator": [
                168,
                213,
                193,
                12,
                77,
                162,
                58,
                235
            ]
        },
        {
            "name": "ticket",
            "discriminator": [
                41,
                228,
                24,
                165,
                78,
                90,
                235,
                200
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "winnerAlreadyExists",
            "msg": "Winner already exists."
        },
        {
            "code": 6001,
            "name": "noTicketsLeft",
            "msg": "No tickets left."
        },
        {
            "code": 6002,
            "name": "noParticipants",
            "msg": "No one has bought your ticket. Winner cannot be announced yet."
        },
        {
            "code": 6003,
            "name": "noWinner",
            "msg": "Winner has not been chosen."
        },
        {
            "code": 6004,
            "name": "invalidWinner",
            "msg": "Invalid Winner"
        },
        {
            "code": 6005,
            "name": "lotteryClosed",
            "msg": "The prize have been already claim"
        }
    ],
    "types": [
        {
            "name": "lottery",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "id",
                        "type": "u32"
                    },
                    {
                        "name": "authority",
                        "type": "pubkey"
                    },
                    {
                        "name": "ticketPrice",
                        "type": "u64"
                    },
                    {
                        "name": "lastTicketNumber",
                        "type": "u32"
                    },
                    {
                        "name": "winnerId",
                        "type": {
                            "option": "u32"
                        }
                    },
                    {
                        "name": "claimed",
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "master",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "lastId",
                        "type": "u32"
                    }
                ]
            }
        },
        {
            "name": "ticket",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "id",
                        "type": "u32"
                    },
                    {
                        "name": "authority",
                        "type": "pubkey"
                    },
                    {
                        "name": "lotteryId",
                        "type": "u32"
                    }
                ]
            }
        }
    ]
};
