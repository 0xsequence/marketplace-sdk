//#region src/utils/abi/primary-sale/sequence-721-sales-contract-v0.ts
const ERC721_SALE_ABI_V0 = [
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
		name: "checkMerkleProof",
		inputs: [
			{
				name: "root",
				type: "bytes32",
				internalType: "bytes32"
			},
			{
				name: "proof",
				type: "bytes32[]",
				internalType: "bytes32[]"
			},
			{
				name: "addr",
				type: "address",
				internalType: "address"
			},
			{
				name: "salt",
				type: "bytes32",
				internalType: "bytes32"
			}
		],
		outputs: [{
			name: "",
			type: "bool",
			internalType: "bool"
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
		inputs: [{
			name: "owner",
			type: "address",
			internalType: "address"
		}, {
			name: "items",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "itemsContract",
		inputs: [],
		outputs: [{
			name: "",
			type: "address",
			internalType: "address"
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
				name: "amount",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "paymentToken",
				type: "address",
				internalType: "address"
			},
			{
				name: "maxTotal",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "proof",
				type: "bytes32[]",
				internalType: "bytes32[]"
			}
		],
		outputs: [],
		stateMutability: "payable"
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
		name: "saleDetails",
		inputs: [],
		outputs: [{
			name: "",
			type: "tuple",
			internalType: "struct IERC721SaleFunctions.SaleDetails",
			components: [
				{
					name: "supplyCap",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "cost",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "paymentToken",
					type: "address",
					internalType: "address"
				},
				{
					name: "startTime",
					type: "uint64",
					internalType: "uint64"
				},
				{
					name: "endTime",
					type: "uint64",
					internalType: "uint64"
				},
				{
					name: "merkleRoot",
					type: "bytes32",
					internalType: "bytes32"
				}
			]
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "setSaleDetails",
		inputs: [
			{
				name: "supplyCap",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "cost",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "paymentToken",
				type: "address",
				internalType: "address"
			},
			{
				name: "startTime",
				type: "uint64",
				internalType: "uint64"
			},
			{
				name: "endTime",
				type: "uint64",
				internalType: "uint64"
			},
			{
				name: "merkleRoot",
				type: "bytes32",
				internalType: "bytes32"
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
		name: "withdrawERC20",
		inputs: [
			{
				name: "token",
				type: "address",
				internalType: "address"
			},
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "value",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "withdrawETH",
		inputs: [{
			name: "to",
			type: "address",
			internalType: "address"
		}, {
			name: "value",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [],
		stateMutability: "nonpayable"
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
		name: "SaleDetailsUpdated",
		inputs: [
			{
				name: "supplyCap",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "cost",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "paymentToken",
				type: "address",
				indexed: false,
				internalType: "address"
			},
			{
				name: "startTime",
				type: "uint64",
				indexed: false,
				internalType: "uint64"
			},
			{
				name: "endTime",
				type: "uint64",
				indexed: false,
				internalType: "uint64"
			},
			{
				name: "merkleRoot",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32"
			}
		],
		anonymous: false
	},
	{
		type: "error",
		name: "InsufficientPayment",
		inputs: [
			{
				name: "currency",
				type: "address",
				internalType: "address"
			},
			{
				name: "expected",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "actual",
				type: "uint256",
				internalType: "uint256"
			}
		]
	},
	{
		type: "error",
		name: "InsufficientSupply",
		inputs: [
			{
				name: "currentSupply",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "amount",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "maxSupply",
				type: "uint256",
				internalType: "uint256"
			}
		]
	},
	{
		type: "error",
		name: "InvalidInitialization",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidSaleDetails",
		inputs: []
	},
	{
		type: "error",
		name: "MerkleProofInvalid",
		inputs: [
			{
				name: "root",
				type: "bytes32",
				internalType: "bytes32"
			},
			{
				name: "proof",
				type: "bytes32[]",
				internalType: "bytes32[]"
			},
			{
				name: "addr",
				type: "address",
				internalType: "address"
			},
			{
				name: "salt",
				type: "bytes32",
				internalType: "bytes32"
			}
		]
	},
	{
		type: "error",
		name: "SaleInactive",
		inputs: []
	},
	{
		type: "error",
		name: "WithdrawFailed",
		inputs: []
	}
];

//#endregion
//#region src/utils/abi/primary-sale/sequence-721-sales-contract-v1.ts
const ERC721_SALE_ABI_V1 = [
	{
		inputs: [
			{
				internalType: "address",
				name: "currency",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "expected",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "actual",
				type: "uint256"
			}
		],
		name: "InsufficientPayment",
		type: "error"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "remainingSupply",
			type: "uint256"
		}, {
			internalType: "uint256",
			name: "amount",
			type: "uint256"
		}],
		name: "InsufficientSupply",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidInitialization",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidSaleDetails",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "root",
				type: "bytes32"
			},
			{
				internalType: "bytes32[]",
				name: "proof",
				type: "bytes32[]"
			},
			{
				internalType: "address",
				name: "addr",
				type: "address"
			},
			{
				internalType: "bytes32",
				name: "salt",
				type: "bytes32"
			}
		],
		name: "MerkleProofInvalid",
		type: "error"
	},
	{
		inputs: [],
		name: "SaleInactive",
		type: "error"
	},
	{
		inputs: [],
		name: "WithdrawFailed",
		type: "error"
	},
	{
		anonymous: false,
		inputs: [{
			indexed: false,
			internalType: "address",
			name: "to",
			type: "address"
		}, {
			indexed: false,
			internalType: "uint256",
			name: "amount",
			type: "uint256"
		}],
		name: "ItemsMinted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "previousAdminRole",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "newAdminRole",
				type: "bytes32"
			}
		],
		name: "RoleAdminChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			}
		],
		name: "RoleGranted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			}
		],
		name: "RoleRevoked",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "remainingSupply",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "cost",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "paymentToken",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "startTime",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "endTime",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "merkleRoot",
				type: "bytes32"
			}
		],
		name: "SaleDetailsUpdated",
		type: "event"
	},
	{
		inputs: [],
		name: "DEFAULT_ADMIN_ROLE",
		outputs: [{
			internalType: "bytes32",
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "wallet",
				type: "address"
			},
			{
				components: [
					{
						internalType: "address",
						name: "approvedSigner",
						type: "address"
					},
					{
						internalType: "bytes4",
						name: "identityType",
						type: "bytes4"
					},
					{
						internalType: "bytes32",
						name: "issuerHash",
						type: "bytes32"
					},
					{
						internalType: "bytes32",
						name: "audienceHash",
						type: "bytes32"
					},
					{
						internalType: "bytes",
						name: "applicationData",
						type: "bytes"
					},
					{
						components: [{
							internalType: "string",
							name: "redirectUrl",
							type: "string"
						}, {
							internalType: "uint64",
							name: "issuedAt",
							type: "uint64"
						}],
						internalType: "struct AuthData",
						name: "authData",
						type: "tuple"
					}
				],
				internalType: "struct Attestation",
				name: "attestation",
				type: "tuple"
			},
			{
				components: [
					{
						internalType: "address",
						name: "to",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "value",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes"
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256"
					},
					{
						internalType: "bool",
						name: "delegateCall",
						type: "bool"
					},
					{
						internalType: "bool",
						name: "onlyFallback",
						type: "bool"
					},
					{
						internalType: "uint256",
						name: "behaviorOnError",
						type: "uint256"
					}
				],
				internalType: "struct Payload.Call",
				name: "call",
				type: "tuple"
			}
		],
		name: "acceptImplicitRequest",
		outputs: [{
			internalType: "bytes32",
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "root",
				type: "bytes32"
			},
			{
				internalType: "bytes32[]",
				name: "proof",
				type: "bytes32[]"
			},
			{
				internalType: "address",
				name: "addr",
				type: "address"
			},
			{
				internalType: "bytes32",
				name: "salt",
				type: "bytes32"
			}
		],
		name: "checkMerkleProof",
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
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}],
		name: "getRoleAdmin",
		outputs: [{
			internalType: "bytes32",
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "uint256",
			name: "index",
			type: "uint256"
		}],
		name: "getRoleMember",
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
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}],
		name: "getRoleMemberCount",
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
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "address",
			name: "account",
			type: "address"
		}],
		name: "grantRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "address",
			name: "account",
			type: "address"
		}],
		name: "hasRole",
		outputs: [{
			internalType: "bool",
			name: "",
			type: "bool"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "items",
				type: "address"
			},
			{
				internalType: "address",
				name: "implicitModeValidator",
				type: "address"
			},
			{
				internalType: "bytes32",
				name: "implicitModeProjectId",
				type: "bytes32"
			}
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [],
		name: "itemsContract",
		outputs: [{
			internalType: "address",
			name: "",
			type: "address"
		}],
		stateMutability: "view",
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
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "paymentToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "maxTotal",
				type: "uint256"
			},
			{
				internalType: "bytes32[]",
				name: "proof",
				type: "bytes32[]"
			}
		],
		name: "mint",
		outputs: [],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "address",
			name: "account",
			type: "address"
		}],
		name: "renounceRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "address",
			name: "account",
			type: "address"
		}],
		name: "revokeRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [],
		name: "saleDetails",
		outputs: [{
			components: [
				{
					internalType: "uint256",
					name: "remainingSupply",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "cost",
					type: "uint256"
				},
				{
					internalType: "address",
					name: "paymentToken",
					type: "address"
				},
				{
					internalType: "uint64",
					name: "startTime",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "endTime",
					type: "uint64"
				},
				{
					internalType: "bytes32",
					name: "merkleRoot",
					type: "bytes32"
				}
			],
			internalType: "struct IERC721SaleFunctions.SaleDetails",
			name: "",
			type: "tuple"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "projectId",
			type: "bytes32"
		}],
		name: "setImplicitModeProjectId",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "validator",
			type: "address"
		}],
		name: "setImplicitModeValidator",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "remainingSupply",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "cost",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "paymentToken",
				type: "address"
			},
			{
				internalType: "uint64",
				name: "startTime",
				type: "uint64"
			},
			{
				internalType: "uint64",
				name: "endTime",
				type: "uint64"
			},
			{
				internalType: "bytes32",
				name: "merkleRoot",
				type: "bytes32"
			}
		],
		name: "setSaleDetails",
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
		inputs: [
			{
				internalType: "address",
				name: "token",
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
		name: "withdrawERC20",
		outputs: [],
		stateMutability: "nonpayable",
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
		name: "withdrawETH",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	}
];

//#endregion
//#region src/utils/abi/primary-sale/sequence-1155-sales-contract-v0.ts
const ERC1155_SALES_CONTRACT_ABI_V0 = [
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
		name: "checkMerkleProof",
		inputs: [
			{
				name: "root",
				type: "bytes32",
				internalType: "bytes32"
			},
			{
				name: "proof",
				type: "bytes32[]",
				internalType: "bytes32[]"
			},
			{
				name: "addr",
				type: "address",
				internalType: "address"
			},
			{
				name: "salt",
				type: "bytes32",
				internalType: "bytes32"
			}
		],
		outputs: [{
			name: "",
			type: "bool",
			internalType: "bool"
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
		name: "globalSaleDetails",
		inputs: [],
		outputs: [{
			name: "",
			type: "tuple",
			internalType: "struct IERC1155SaleFunctions.SaleDetails",
			components: [
				{
					name: "cost",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "supplyCap",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "startTime",
					type: "uint64",
					internalType: "uint64"
				},
				{
					name: "endTime",
					type: "uint64",
					internalType: "uint64"
				},
				{
					name: "merkleRoot",
					type: "bytes32",
					internalType: "bytes32"
				}
			]
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
		inputs: [{
			name: "owner",
			type: "address",
			internalType: "address"
		}, {
			name: "items",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
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
			},
			{
				name: "expectedPaymentToken",
				type: "address",
				internalType: "address"
			},
			{
				name: "maxTotal",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "proof",
				type: "bytes32[]",
				internalType: "bytes32[]"
			}
		],
		outputs: [],
		stateMutability: "payable"
	},
	{
		type: "function",
		name: "paymentToken",
		inputs: [],
		outputs: [{
			name: "",
			type: "address",
			internalType: "address"
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
		name: "setGlobalSaleDetails",
		inputs: [
			{
				name: "cost",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "supplyCap",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "startTime",
				type: "uint64",
				internalType: "uint64"
			},
			{
				name: "endTime",
				type: "uint64",
				internalType: "uint64"
			},
			{
				name: "merkleRoot",
				type: "bytes32",
				internalType: "bytes32"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setPaymentToken",
		inputs: [{
			name: "paymentTokenAddr",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setTokenSaleDetails",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "cost",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "supplyCap",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "startTime",
				type: "uint64",
				internalType: "uint64"
			},
			{
				name: "endTime",
				type: "uint64",
				internalType: "uint64"
			},
			{
				name: "merkleRoot",
				type: "bytes32",
				internalType: "bytes32"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setTokenSaleDetailsBatch",
		inputs: [
			{
				name: "tokenIds",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "costs",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "supplyCaps",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "startTimes",
				type: "uint64[]",
				internalType: "uint64[]"
			},
			{
				name: "endTimes",
				type: "uint64[]",
				internalType: "uint64[]"
			},
			{
				name: "merkleRoots",
				type: "bytes32[]",
				internalType: "bytes32[]"
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
		name: "tokenSaleDetails",
		inputs: [{
			name: "tokenId",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [{
			name: "",
			type: "tuple",
			internalType: "struct IERC1155SaleFunctions.SaleDetails",
			components: [
				{
					name: "cost",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "supplyCap",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "startTime",
					type: "uint64",
					internalType: "uint64"
				},
				{
					name: "endTime",
					type: "uint64",
					internalType: "uint64"
				},
				{
					name: "merkleRoot",
					type: "bytes32",
					internalType: "bytes32"
				}
			]
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "tokenSaleDetailsBatch",
		inputs: [{
			name: "tokenIds",
			type: "uint256[]",
			internalType: "uint256[]"
		}],
		outputs: [{
			name: "",
			type: "tuple[]",
			internalType: "struct IERC1155SaleFunctions.SaleDetails[]",
			components: [
				{
					name: "cost",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "supplyCap",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "startTime",
					type: "uint64",
					internalType: "uint64"
				},
				{
					name: "endTime",
					type: "uint64",
					internalType: "uint64"
				},
				{
					name: "merkleRoot",
					type: "bytes32",
					internalType: "bytes32"
				}
			]
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "withdrawERC20",
		inputs: [
			{
				name: "token",
				type: "address",
				internalType: "address"
			},
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "value",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "withdrawETH",
		inputs: [{
			name: "to",
			type: "address",
			internalType: "address"
		}, {
			name: "value",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "event",
		name: "GlobalSaleDetailsUpdated",
		inputs: [
			{
				name: "cost",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "supplyCap",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "startTime",
				type: "uint64",
				indexed: false,
				internalType: "uint64"
			},
			{
				name: "endTime",
				type: "uint64",
				indexed: false,
				internalType: "uint64"
			},
			{
				name: "merkleRoot",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "ItemsMinted",
		inputs: [
			{
				name: "to",
				type: "address",
				indexed: false,
				internalType: "address"
			},
			{
				name: "tokenIds",
				type: "uint256[]",
				indexed: false,
				internalType: "uint256[]"
			},
			{
				name: "amounts",
				type: "uint256[]",
				indexed: false,
				internalType: "uint256[]"
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
		name: "TokenSaleDetailsUpdated",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "cost",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "supplyCap",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "startTime",
				type: "uint64",
				indexed: false,
				internalType: "uint64"
			},
			{
				name: "endTime",
				type: "uint64",
				indexed: false,
				internalType: "uint64"
			},
			{
				name: "merkleRoot",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32"
			}
		],
		anonymous: false
	},
	{
		type: "error",
		name: "GlobalSaleInactive",
		inputs: []
	},
	{
		type: "error",
		name: "InsufficientPayment",
		inputs: [
			{
				name: "currency",
				type: "address",
				internalType: "address"
			},
			{
				name: "expected",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "actual",
				type: "uint256",
				internalType: "uint256"
			}
		]
	},
	{
		type: "error",
		name: "InsufficientSupply",
		inputs: [
			{
				name: "currentSupply",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "requestedAmount",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "maxSupply",
				type: "uint256",
				internalType: "uint256"
			}
		]
	},
	{
		type: "error",
		name: "InvalidInitialization",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidSaleDetails",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidTokenIds",
		inputs: []
	},
	{
		type: "error",
		name: "MerkleProofInvalid",
		inputs: [
			{
				name: "root",
				type: "bytes32",
				internalType: "bytes32"
			},
			{
				name: "proof",
				type: "bytes32[]",
				internalType: "bytes32[]"
			},
			{
				name: "addr",
				type: "address",
				internalType: "address"
			},
			{
				name: "salt",
				type: "bytes32",
				internalType: "bytes32"
			}
		]
	},
	{
		type: "error",
		name: "SaleInactive",
		inputs: [{
			name: "tokenId",
			type: "uint256",
			internalType: "uint256"
		}]
	},
	{
		type: "error",
		name: "WithdrawFailed",
		inputs: []
	}
];

//#endregion
//#region src/utils/abi/primary-sale/sequence-1155-sales-contract-v1.ts
const ERC1155_SALES_CONTRACT_ABI_V1 = [
	{
		inputs: [],
		name: "GlobalSaleInactive",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "currency",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "expected",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "actual",
				type: "uint256"
			}
		],
		name: "InsufficientPayment",
		type: "error"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "remainingSupply",
			type: "uint256"
		}, {
			internalType: "uint256",
			name: "amount",
			type: "uint256"
		}],
		name: "InsufficientSupply",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidInitialization",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidSaleDetails",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidTokenIds",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "root",
				type: "bytes32"
			},
			{
				internalType: "bytes32[]",
				name: "proof",
				type: "bytes32[]"
			},
			{
				internalType: "address",
				name: "addr",
				type: "address"
			},
			{
				internalType: "bytes32",
				name: "salt",
				type: "bytes32"
			}
		],
		name: "MerkleProofInvalid",
		type: "error"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "tokenId",
			type: "uint256"
		}],
		name: "SaleInactive",
		type: "error"
	},
	{
		inputs: [],
		name: "WithdrawFailed",
		type: "error"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "minTokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "maxTokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "cost",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "remainingSupply",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "startTime",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "endTime",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "merkleRoot",
				type: "bytes32"
			}
		],
		name: "GlobalSaleDetailsUpdated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "tokenIds",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		name: "ItemsMinted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "previousAdminRole",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "newAdminRole",
				type: "bytes32"
			}
		],
		name: "RoleAdminChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			}
		],
		name: "RoleGranted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			}
		],
		name: "RoleRevoked",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "cost",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "remainingSupply",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "startTime",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "endTime",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "merkleRoot",
				type: "bytes32"
			}
		],
		name: "TokenSaleDetailsUpdated",
		type: "event"
	},
	{
		inputs: [],
		name: "DEFAULT_ADMIN_ROLE",
		outputs: [{
			internalType: "bytes32",
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "wallet",
				type: "address"
			},
			{
				components: [
					{
						internalType: "address",
						name: "approvedSigner",
						type: "address"
					},
					{
						internalType: "bytes4",
						name: "identityType",
						type: "bytes4"
					},
					{
						internalType: "bytes32",
						name: "issuerHash",
						type: "bytes32"
					},
					{
						internalType: "bytes32",
						name: "audienceHash",
						type: "bytes32"
					},
					{
						internalType: "bytes",
						name: "applicationData",
						type: "bytes"
					},
					{
						components: [{
							internalType: "string",
							name: "redirectUrl",
							type: "string"
						}, {
							internalType: "uint64",
							name: "issuedAt",
							type: "uint64"
						}],
						internalType: "struct AuthData",
						name: "authData",
						type: "tuple"
					}
				],
				internalType: "struct Attestation",
				name: "attestation",
				type: "tuple"
			},
			{
				components: [
					{
						internalType: "address",
						name: "to",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "value",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes"
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256"
					},
					{
						internalType: "bool",
						name: "delegateCall",
						type: "bool"
					},
					{
						internalType: "bool",
						name: "onlyFallback",
						type: "bool"
					},
					{
						internalType: "uint256",
						name: "behaviorOnError",
						type: "uint256"
					}
				],
				internalType: "struct Payload.Call",
				name: "call",
				type: "tuple"
			}
		],
		name: "acceptImplicitRequest",
		outputs: [{
			internalType: "bytes32",
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "root",
				type: "bytes32"
			},
			{
				internalType: "bytes32[]",
				name: "proof",
				type: "bytes32[]"
			},
			{
				internalType: "address",
				name: "addr",
				type: "address"
			},
			{
				internalType: "bytes32",
				name: "salt",
				type: "bytes32"
			}
		],
		name: "checkMerkleProof",
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
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}],
		name: "getRoleAdmin",
		outputs: [{
			internalType: "bytes32",
			name: "",
			type: "bytes32"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "uint256",
			name: "index",
			type: "uint256"
		}],
		name: "getRoleMember",
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
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}],
		name: "getRoleMemberCount",
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
		name: "globalSaleDetails",
		outputs: [{
			components: [
				{
					internalType: "uint256",
					name: "minTokenId",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "maxTokenId",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "cost",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "remainingSupply",
					type: "uint256"
				},
				{
					internalType: "uint64",
					name: "startTime",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "endTime",
					type: "uint64"
				},
				{
					internalType: "bytes32",
					name: "merkleRoot",
					type: "bytes32"
				}
			],
			internalType: "struct IERC1155SaleFunctions.GlobalSaleDetails",
			name: "",
			type: "tuple"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "address",
			name: "account",
			type: "address"
		}],
		name: "grantRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "address",
			name: "account",
			type: "address"
		}],
		name: "hasRole",
		outputs: [{
			internalType: "bool",
			name: "",
			type: "bool"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "items",
				type: "address"
			},
			{
				internalType: "address",
				name: "implicitModeValidator",
				type: "address"
			},
			{
				internalType: "bytes32",
				name: "implicitModeProjectId",
				type: "bytes32"
			}
		],
		name: "initialize",
		outputs: [],
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
				internalType: "uint256[]",
				name: "tokenIds",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			},
			{
				internalType: "address",
				name: "expectedPaymentToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "maxTotal",
				type: "uint256"
			},
			{
				internalType: "bytes32[]",
				name: "proof",
				type: "bytes32[]"
			}
		],
		name: "mint",
		outputs: [],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [],
		name: "paymentToken",
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
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "address",
			name: "account",
			type: "address"
		}],
		name: "renounceRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "role",
			type: "bytes32"
		}, {
			internalType: "address",
			name: "account",
			type: "address"
		}],
		name: "revokeRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "minTokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "maxTokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "cost",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "remainingSupply",
				type: "uint256"
			},
			{
				internalType: "uint64",
				name: "startTime",
				type: "uint64"
			},
			{
				internalType: "uint64",
				name: "endTime",
				type: "uint64"
			},
			{
				internalType: "bytes32",
				name: "merkleRoot",
				type: "bytes32"
			}
		],
		name: "setGlobalSaleDetails",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "bytes32",
			name: "projectId",
			type: "bytes32"
		}],
		name: "setImplicitModeProjectId",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "validator",
			type: "address"
		}],
		name: "setImplicitModeValidator",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "paymentTokenAddr",
			type: "address"
		}],
		name: "setPaymentToken",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "cost",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "remainingSupply",
				type: "uint256"
			},
			{
				internalType: "uint64",
				name: "startTime",
				type: "uint64"
			},
			{
				internalType: "uint64",
				name: "endTime",
				type: "uint64"
			},
			{
				internalType: "bytes32",
				name: "merkleRoot",
				type: "bytes32"
			}
		],
		name: "setTokenSaleDetails",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "tokenIds",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "costs",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "remainingSupplies",
				type: "uint256[]"
			},
			{
				internalType: "uint64[]",
				name: "startTimes",
				type: "uint64[]"
			},
			{
				internalType: "uint64[]",
				name: "endTimes",
				type: "uint64[]"
			},
			{
				internalType: "bytes32[]",
				name: "merkleRoots",
				type: "bytes32[]"
			}
		],
		name: "setTokenSaleDetailsBatch",
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
		inputs: [{
			internalType: "uint256",
			name: "tokenId",
			type: "uint256"
		}],
		name: "tokenSaleDetails",
		outputs: [{
			components: [
				{
					internalType: "uint256",
					name: "cost",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "remainingSupply",
					type: "uint256"
				},
				{
					internalType: "uint64",
					name: "startTime",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "endTime",
					type: "uint64"
				},
				{
					internalType: "bytes32",
					name: "merkleRoot",
					type: "bytes32"
				}
			],
			internalType: "struct IERC1155SaleFunctions.SaleDetails",
			name: "",
			type: "tuple"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256[]",
			name: "tokenIds",
			type: "uint256[]"
		}],
		name: "tokenSaleDetailsBatch",
		outputs: [{
			components: [
				{
					internalType: "uint256",
					name: "cost",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "remainingSupply",
					type: "uint256"
				},
				{
					internalType: "uint64",
					name: "startTime",
					type: "uint64"
				},
				{
					internalType: "uint64",
					name: "endTime",
					type: "uint64"
				},
				{
					internalType: "bytes32",
					name: "merkleRoot",
					type: "bytes32"
				}
			],
			internalType: "struct IERC1155SaleFunctions.SaleDetails[]",
			name: "",
			type: "tuple[]"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
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
		name: "withdrawERC20",
		outputs: [],
		stateMutability: "nonpayable",
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
		name: "withdrawETH",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	}
];

//#endregion
export { ERC721_SALE_ABI_V0 as i, ERC1155_SALES_CONTRACT_ABI_V0 as n, ERC721_SALE_ABI_V1 as r, ERC1155_SALES_CONTRACT_ABI_V1 as t };
//# sourceMappingURL=primary-sale.js.map