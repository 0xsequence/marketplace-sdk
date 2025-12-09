//#region src/utils/abi/token/ERC20.ts
const ERC20_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [{
			internalType: "address",
			name: "owner",
			type: "address"
		}, {
			internalType: "address",
			name: "spender",
			type: "address"
		}],
		name: "allowance",
		outputs: [{
			internalType: "uint256",
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "spender",
			type: "address"
		}, {
			internalType: "uint256",
			name: "value",
			type: "uint256"
		}],
		name: "approve",
		outputs: [{
			internalType: "bool",
			name: "",
			type: "bool"
		}],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "who",
			type: "address"
		}],
		name: "balanceOf",
		outputs: [{
			internalType: "uint256",
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "totalSupply",
		outputs: [{
			internalType: "uint256",
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "to",
			type: "address"
		}, {
			internalType: "uint256",
			name: "value",
			type: "uint256"
		}],
		name: "transfer",
		outputs: [{
			internalType: "bool",
			name: "",
			type: "bool"
		}],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [{
			internalType: "bool",
			name: "",
			type: "bool"
		}],
		stateMutability: "nonpayable",
		type: "function"
	}
];

//#endregion
//#region src/utils/abi/token/ERC721.ts
const ERC721_ABI = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [],
		name: "AlreadyInitialized",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidMintRequest",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidSequenceConfig",
		type: "error"
	},
	{
		inputs: [],
		name: "NotAuthorized",
		type: "error"
	},
	{
		inputs: [],
		name: "SequenceIsSealed",
		type: "error"
	},
	{
		inputs: [],
		name: "SequenceSupplyExhausted",
		type: "error"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "id",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "ApprovalForAll",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [{
			indexed: false,
			internalType: "string",
			name: "topic",
			type: "string"
		}, {
			indexed: false,
			internalType: "string",
			name: "message",
			type: "string"
		}],
		name: "Broadcast",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [{
			indexed: true,
			internalType: "address",
			name: "previousOwner",
			type: "address"
		}, {
			indexed: true,
			internalType: "address",
			name: "newOwner",
			type: "address"
		}],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "uint16",
				name: "sequenceId",
				type: "uint16"
			},
			{
				indexed: false,
				internalType: "uint80",
				name: "data",
				type: "uint80"
			}
		],
		name: "RecordCreated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint16",
				name: "sequenceId",
				type: "uint16"
			},
			{
				components: [
					{
						internalType: "uint64",
						name: "sealedBeforeTimestamp",
						type: "uint64"
					},
					{
						internalType: "uint64",
						name: "sealedAfterTimestamp",
						type: "uint64"
					},
					{
						internalType: "uint64",
						name: "maxSupply",
						type: "uint64"
					},
					{
						internalType: "uint64",
						name: "minted",
						type: "uint64"
					},
					{
						internalType: "contract IEngine",
						name: "engine",
						type: "address"
					},
					{
						internalType: "uint64",
						name: "dropNodeId",
						type: "uint64"
					}
				],
				indexed: false,
				internalType: "struct SequenceData",
				name: "sequenceData",
				type: "tuple"
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "engineData",
				type: "bytes"
			}
		],
		name: "SequenceConfigured",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "id",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [],
		name: "accessControl",
		outputs: [{
			internalType: "contract INodeRegistry",
			name: "nodeRegistry",
			type: "address"
		}, {
			internalType: "uint64",
			name: "controlNodeId",
			type: "uint64"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "spender",
			type: "address"
		}, {
			internalType: "uint256",
			name: "id",
			type: "uint256"
		}],
		name: "approve",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "owner",
			type: "address"
		}],
		name: "balanceOf",
		outputs: [{
			internalType: "uint256",
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "string",
			name: "topic",
			type: "string"
		}, {
			internalType: "string",
			name: "message",
			type: "string"
		}],
		name: "broadcast",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			components: [
				{
					internalType: "uint64",
					name: "sealedBeforeTimestamp",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "sealedAfterTimestamp",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "maxSupply",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "minted",
					type: "uint64"
				},
				{
					internalType: "contract IEngine",
					name: "engine",
					type: "address"
				},
				{
					internalType: "uint64",
					name: "dropNodeId",
					type: "uint64"
				}
			],
			internalType: "struct SequenceData",
			name: "_sequence",
			type: "tuple"
		}, {
			internalType: "bytes",
			name: "_engineData",
			type: "bytes"
		}],
		name: "configureSequence",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [],
		name: "contractURI",
		outputs: [{
			internalType: "string",
			name: "value",
			type: "string"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "controlNode",
		outputs: [{
			internalType: "uint64",
			name: "nodeId",
			type: "uint64"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "",
			type: "uint256"
		}],
		name: "getApproved",
		outputs: [{
			internalType: "address",
			name: "",
			type: "address"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint16",
			name: "sequenceId",
			type: "uint16"
		}],
		name: "getSequenceData",
		outputs: [{
			components: [
				{
					internalType: "uint64",
					name: "sealedBeforeTimestamp",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "sealedAfterTimestamp",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "maxSupply",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "minted",
					type: "uint64"
				},
				{
					internalType: "contract IEngine",
					name: "engine",
					type: "address"
				},
				{
					internalType: "uint64",
					name: "dropNodeId",
					type: "uint64"
				}
			],
			internalType: "struct SequenceData",
			name: "sequence",
			type: "tuple"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "id",
			type: "uint256"
		}],
		name: "getTokenData",
		outputs: [{
			components: [
				{
					internalType: "address",
					name: "owner",
					type: "address"
				},
				{
					internalType: "uint16",
					name: "sequenceId",
					type: "uint16"
				},
				{
					internalType: "uint80",
					name: "data",
					type: "uint80"
				}
			],
			internalType: "struct TokenData",
			name: "",
			type: "tuple"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_owner",
				type: "address"
			},
			{
				components: [{
					internalType: "contract INodeRegistry",
					name: "nodeRegistry",
					type: "address"
				}, {
					internalType: "uint64",
					name: "controlNodeId",
					type: "uint64"
				}],
				internalType: "struct AccessControlData",
				name: "_accessControl",
				type: "tuple"
			},
			{
				internalType: "string",
				name: "_metadata",
				type: "string"
			},
			{
				components: [
					{
						internalType: "string",
						name: "name",
						type: "string"
					},
					{
						internalType: "string",
						name: "symbol",
						type: "string"
					},
					{
						internalType: "string",
						name: "contractURI",
						type: "string"
					}
				],
				internalType: "struct ImmutableCollectionData",
				name: "_data",
				type: "tuple"
			}
		],
		name: "init",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "",
			type: "address"
		}, {
			internalType: "address",
			name: "",
			type: "address"
		}],
		name: "isApprovedForAll",
		outputs: [{
			internalType: "bool",
			name: "",
			type: "bool"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "subject",
			type: "address"
		}],
		name: "isAuthorized",
		outputs: [{
			internalType: "bool",
			name: "authorized",
			type: "bool"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "to",
			type: "address"
		}, {
			internalType: "uint16",
			name: "sequenceId",
			type: "uint16"
		}],
		name: "mintRecord",
		outputs: [{
			internalType: "uint256",
			name: "tokenId",
			type: "uint256"
		}],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint16",
				name: "sequenceId",
				type: "uint16"
			},
			{
				internalType: "uint80",
				name: "tokenData",
				type: "uint80"
			}
		],
		name: "mintRecord",
		outputs: [{
			internalType: "uint256",
			name: "tokenId",
			type: "uint256"
		}],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [],
		name: "name",
		outputs: [{
			internalType: "string",
			name: "value",
			type: "string"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "nodeRegistry",
		outputs: [{
			internalType: "contract INodeRegistry",
			name: "",
			type: "address"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{
			internalType: "address",
			name: "",
			type: "address"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "id",
			type: "uint256"
		}],
		name: "ownerOf",
		outputs: [{
			internalType: "address",
			name: "owner",
			type: "address"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "tokenId",
			type: "uint256"
		}, {
			internalType: "uint256",
			name: "salePrice",
			type: "uint256"
		}],
		name: "royaltyInfo",
		outputs: [{
			internalType: "address",
			name: "receiver",
			type: "address"
		}, {
			internalType: "uint256",
			name: "royaltyAmount",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "id",
				type: "uint256"
			}
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "id",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [],
		name: "sequenceCount",
		outputs: [{
			internalType: "uint16",
			name: "",
			type: "uint16"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "operator",
			type: "address"
		}, {
			internalType: "bool",
			name: "approved",
			type: "bool"
		}],
		name: "setApprovalForAll",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "_owner",
			type: "address"
		}],
		name: "setOwner",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes4",
			name: "interfaceId",
			type: "bytes4"
		}],
		name: "supportsInterface",
		outputs: [{
			internalType: "bool",
			name: "",
			type: "bool"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "symbol",
		outputs: [{
			internalType: "string",
			name: "value",
			type: "string"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "tokenId",
			type: "uint256"
		}],
		name: "tokenMintData",
		outputs: [{
			internalType: "uint80",
			name: "data",
			type: "uint80"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "tokenId",
			type: "uint256"
		}],
		name: "tokenSequenceId",
		outputs: [{
			internalType: "uint16",
			name: "sequenceId",
			type: "uint16"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "tokenId",
			type: "uint256"
		}],
		name: "tokenURI",
		outputs: [{
			internalType: "string",
			name: "uri",
			type: "string"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [],
		name: "totalSupply",
		outputs: [{
			internalType: "uint256",
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "id",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	}
];

//#endregion
//#region src/utils/abi/token/ERC1155.ts
const ERC1155_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "_owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "_operator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "_approved",
				type: "bool"
			}
		],
		name: "ApprovalForAll",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "_operator",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "_from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "_to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "_ids",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "_amounts",
				type: "uint256[]"
			}
		],
		name: "TransferBatch",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "_operator",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "_from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "_to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "_id",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "_amount",
				type: "uint256"
			}
		],
		name: "TransferSingle",
		type: "event"
	},
	{
		inputs: [{
			internalType: "address",
			name: "_owner",
			type: "address"
		}, {
			internalType: "uint256",
			name: "_id",
			type: "uint256"
		}],
		name: "balanceOf",
		outputs: [{
			internalType: "uint256",
			name: "",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address[]",
			name: "_owners",
			type: "address[]"
		}, {
			internalType: "uint256[]",
			name: "_ids",
			type: "uint256[]"
		}],
		name: "balanceOfBatch",
		outputs: [{
			internalType: "uint256[]",
			name: "",
			type: "uint256[]"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "_id",
			type: "uint256"
		}],
		name: "getIDBinIndex",
		outputs: [{
			internalType: "uint256",
			name: "bin",
			type: "uint256"
		}, {
			internalType: "uint256",
			name: "index",
			type: "uint256"
		}],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "_binValues",
			type: "uint256"
		}, {
			internalType: "uint256",
			name: "_index",
			type: "uint256"
		}],
		name: "getValueInBin",
		outputs: [{
			internalType: "uint256",
			name: "",
			type: "uint256"
		}],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "_owner",
			type: "address"
		}, {
			internalType: "address",
			name: "_operator",
			type: "address"
		}],
		name: "isApprovedForAll",
		outputs: [{
			internalType: "bool",
			name: "isOperator",
			type: "bool"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_from",
				type: "address"
			},
			{
				internalType: "address",
				name: "_to",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "_ids",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "_amounts",
				type: "uint256[]"
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes"
			}
		],
		name: "safeBatchTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_from",
				type: "address"
			},
			{
				internalType: "address",
				name: "_to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "_id",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes"
			}
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "_operator",
			type: "address"
		}, {
			internalType: "bool",
			name: "_approved",
			type: "bool"
		}],
		name: "setApprovalForAll",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes4",
			name: "_interfaceID",
			type: "bytes4"
		}],
		name: "supportsInterface",
		outputs: [{
			internalType: "bool",
			name: "",
			type: "bool"
		}],
		stateMutability: "pure",
		type: "function"
	}
];

//#endregion
//#region src/utils/abi/token/sequence-erc1155-items.ts
const SEQUENCE_1155_ITEMS_ABI = [
	{
		type: "constructor",
		inputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "DEFAULT_ADMIN_ROLE",
		inputs: [],
		outputs: [{
			name: "",
			type: "bytes32",
			internalType: "bytes32"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "balanceOf",
		inputs: [{
			name: "_owner",
			type: "address",
			internalType: "address"
		}, {
			name: "_id",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [{
			name: "",
			type: "uint256",
			internalType: "uint256"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "balanceOfBatch",
		inputs: [{
			name: "_owners",
			type: "address[]",
			internalType: "address[]"
		}, {
			name: "_ids",
			type: "uint256[]",
			internalType: "uint256[]"
		}],
		outputs: [{
			name: "",
			type: "uint256[]",
			internalType: "uint256[]"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "baseURI",
		inputs: [],
		outputs: [{
			name: "",
			type: "string",
			internalType: "string"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "batchBurn",
		inputs: [{
			name: "tokenIds",
			type: "uint256[]",
			internalType: "uint256[]"
		}, {
			name: "amounts",
			type: "uint256[]",
			internalType: "uint256[]"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "batchMint",
		inputs: [
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenIds",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "amounts",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "data",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "burn",
		inputs: [{
			name: "tokenId",
			type: "uint256",
			internalType: "uint256"
		}, {
			name: "amount",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "contractURI",
		inputs: [],
		outputs: [{
			name: "",
			type: "string",
			internalType: "string"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "getRoleAdmin",
		inputs: [{
			name: "role",
			type: "bytes32",
			internalType: "bytes32"
		}],
		outputs: [{
			name: "",
			type: "bytes32",
			internalType: "bytes32"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "getRoleMember",
		inputs: [{
			name: "role",
			type: "bytes32",
			internalType: "bytes32"
		}, {
			name: "index",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [{
			name: "",
			type: "address",
			internalType: "address"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "getRoleMemberCount",
		inputs: [{
			name: "role",
			type: "bytes32",
			internalType: "bytes32"
		}],
		outputs: [{
			name: "",
			type: "uint256",
			internalType: "uint256"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "grantRole",
		inputs: [{
			name: "role",
			type: "bytes32",
			internalType: "bytes32"
		}, {
			name: "account",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "hasRole",
		inputs: [{
			name: "role",
			type: "bytes32",
			internalType: "bytes32"
		}, {
			name: "account",
			type: "address",
			internalType: "address"
		}],
		outputs: [{
			name: "",
			type: "bool",
			internalType: "bool"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "initialize",
		inputs: [
			{
				name: "owner",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenName",
				type: "string",
				internalType: "string"
			},
			{
				name: "tokenBaseURI",
				type: "string",
				internalType: "string"
			},
			{
				name: "tokenContractURI",
				type: "string",
				internalType: "string"
			},
			{
				name: "royaltyReceiver",
				type: "address",
				internalType: "address"
			},
			{
				name: "royaltyFeeNumerator",
				type: "uint96",
				internalType: "uint96"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "isApprovedForAll",
		inputs: [{
			name: "_owner",
			type: "address",
			internalType: "address"
		}, {
			name: "_operator",
			type: "address",
			internalType: "address"
		}],
		outputs: [{
			name: "isOperator",
			type: "bool",
			internalType: "bool"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "mint",
		inputs: [
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "amount",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "data",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "name",
		inputs: [],
		outputs: [{
			name: "",
			type: "string",
			internalType: "string"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "renounceRole",
		inputs: [{
			name: "role",
			type: "bytes32",
			internalType: "bytes32"
		}, {
			name: "account",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "revokeRole",
		inputs: [{
			name: "role",
			type: "bytes32",
			internalType: "bytes32"
		}, {
			name: "account",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "royaltyInfo",
		inputs: [{
			name: "tokenId",
			type: "uint256",
			internalType: "uint256"
		}, {
			name: "salePrice",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [{
			name: "",
			type: "address",
			internalType: "address"
		}, {
			name: "",
			type: "uint256",
			internalType: "uint256"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "safeBatchTransferFrom",
		inputs: [
			{
				name: "_from",
				type: "address",
				internalType: "address"
			},
			{
				name: "_to",
				type: "address",
				internalType: "address"
			},
			{
				name: "_ids",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "_amounts",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "_data",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "safeTransferFrom",
		inputs: [
			{
				name: "_from",
				type: "address",
				internalType: "address"
			},
			{
				name: "_to",
				type: "address",
				internalType: "address"
			},
			{
				name: "_id",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "_amount",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "_data",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setApprovalForAll",
		inputs: [{
			name: "_operator",
			type: "address",
			internalType: "address"
		}, {
			name: "_approved",
			type: "bool",
			internalType: "bool"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setBaseMetadataURI",
		inputs: [{
			name: "tokenBaseURI",
			type: "string",
			internalType: "string"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setContractName",
		inputs: [{
			name: "tokenName",
			type: "string",
			internalType: "string"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setContractURI",
		inputs: [{
			name: "tokenContractURI",
			type: "string",
			internalType: "string"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setDefaultRoyalty",
		inputs: [{
			name: "receiver",
			type: "address",
			internalType: "address"
		}, {
			name: "feeNumerator",
			type: "uint96",
			internalType: "uint96"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setTokenRoyalty",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "receiver",
				type: "address",
				internalType: "address"
			},
			{
				name: "feeNumerator",
				type: "uint96",
				internalType: "uint96"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "supportsInterface",
		inputs: [{
			name: "interfaceId",
			type: "bytes4",
			internalType: "bytes4"
		}],
		outputs: [{
			name: "",
			type: "bool",
			internalType: "bool"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "tokenSupply",
		inputs: [{
			name: "",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [{
			name: "",
			type: "uint256",
			internalType: "uint256"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "totalSupply",
		inputs: [],
		outputs: [{
			name: "",
			type: "uint256",
			internalType: "uint256"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "uri",
		inputs: [{
			name: "_id",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [{
			name: "",
			type: "string",
			internalType: "string"
		}],
		stateMutability: "view"
	},
	{
		type: "event",
		name: "ApprovalForAll",
		inputs: [
			{
				name: "_owner",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "_operator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "_approved",
				type: "bool",
				indexed: false,
				internalType: "bool"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "RoleAdminChanged",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32"
			},
			{
				name: "previousAdminRole",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32"
			},
			{
				name: "newAdminRole",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "RoleGranted",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32"
			},
			{
				name: "account",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "sender",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "RoleRevoked",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32"
			},
			{
				name: "account",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "sender",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "TransferBatch",
		inputs: [
			{
				name: "_operator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "_from",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "_to",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "_ids",
				type: "uint256[]",
				indexed: false,
				internalType: "uint256[]"
			},
			{
				name: "_amounts",
				type: "uint256[]",
				indexed: false,
				internalType: "uint256[]"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "TransferSingle",
		inputs: [
			{
				name: "_operator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "_from",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "_to",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "_id",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "_amount",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "URI",
		inputs: [{
			name: "_uri",
			type: "string",
			indexed: false,
			internalType: "string"
		}, {
			name: "_id",
			type: "uint256",
			indexed: true,
			internalType: "uint256"
		}],
		anonymous: false
	},
	{
		type: "error",
		name: "InvalidArrayLength",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidInitialization",
		inputs: []
	}
];

//#endregion
export { ERC20_ABI as i, ERC1155_ABI as n, ERC721_ABI as r, SEQUENCE_1155_ITEMS_ABI as t };
//# sourceMappingURL=token.js.map