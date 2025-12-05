//#region src/utils/abi/marketplace/EIP2981.ts
const EIP2981_ABI = [{
	inputs: [{
		internalType: "uint256",
		name: "",
		type: "uint256"
	}, {
		internalType: "uint256",
		name: "_saleCost",
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
}];

//#endregion
//#region src/utils/abi/marketplace/sequence-marketplace-v1.ts
const SequenceMarketplaceV1_ABI = [
	{
		inputs: [{
			internalType: "address",
			name: "_owner",
			type: "address"
		}],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [],
		name: "InvalidAdditionalFees",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidBatchRequest",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidCurrency",
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
				name: "quantity",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "InvalidCurrencyApproval",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidExpiry",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidPrice",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidQuantity",
		type: "error"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "requestId",
			type: "uint256"
		}],
		name: "InvalidRequestId",
		type: "error"
	},
	{
		inputs: [],
		name: "InvalidRoyalty",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenContract",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "quantity",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "InvalidTokenApproval",
		type: "error"
	},
	{
		inputs: [{
			internalType: "address",
			name: "contractAddress",
			type: "address"
		}, {
			internalType: "bytes4",
			name: "interfaceId",
			type: "bytes4"
		}],
		name: "UnsupportedContractInterface",
		type: "error"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "tokenContract",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint96",
				name: "fee",
				type: "uint96"
			}
		],
		name: "CustomRoyaltyChanged",
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
				name: "requestId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "buyer",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "tokenContract",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "receiver",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "quantity",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "quantityRemaining",
				type: "uint256"
			}
		],
		name: "RequestAccepted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [{
			indexed: true,
			internalType: "uint256",
			name: "requestId",
			type: "uint256"
		}, {
			indexed: true,
			internalType: "address",
			name: "tokenContract",
			type: "address"
		}],
		name: "RequestCancelled",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "requestId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "creator",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "tokenContract",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "isListing",
				type: "bool"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "quantity",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "currency",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "pricePerToken",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "expiry",
				type: "uint256"
			}
		],
		name: "RequestCreated",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "requestId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "quantity",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "receiver",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "additionalFees",
				type: "uint256[]"
			},
			{
				internalType: "address[]",
				name: "additionalFeeReceivers",
				type: "address[]"
			}
		],
		name: "acceptRequest",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "requestIds",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "quantities",
				type: "uint256[]"
			},
			{
				internalType: "address[]",
				name: "receivers",
				type: "address[]"
			},
			{
				internalType: "uint256[]",
				name: "additionalFees",
				type: "uint256[]"
			},
			{
				internalType: "address[]",
				name: "additionalFeeReceivers",
				type: "address[]"
			}
		],
		name: "acceptRequestBatch",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "requestId",
			type: "uint256"
		}],
		name: "cancelRequest",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256[]",
			name: "requestIds",
			type: "uint256[]"
		}],
		name: "cancelRequestBatch",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			components: [
				{
					internalType: "bool",
					name: "isListing",
					type: "bool"
				},
				{
					internalType: "bool",
					name: "isERC1155",
					type: "bool"
				},
				{
					internalType: "address",
					name: "tokenContract",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "quantity",
					type: "uint256"
				},
				{
					internalType: "uint96",
					name: "expiry",
					type: "uint96"
				},
				{
					internalType: "address",
					name: "currency",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "pricePerToken",
					type: "uint256"
				}
			],
			internalType: "struct ISequenceMarketStorage.RequestParams",
			name: "request",
			type: "tuple"
		}],
		name: "createRequest",
		outputs: [{
			internalType: "uint256",
			name: "requestId",
			type: "uint256"
		}],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			components: [
				{
					internalType: "bool",
					name: "isListing",
					type: "bool"
				},
				{
					internalType: "bool",
					name: "isERC1155",
					type: "bool"
				},
				{
					internalType: "address",
					name: "tokenContract",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "quantity",
					type: "uint256"
				},
				{
					internalType: "uint96",
					name: "expiry",
					type: "uint96"
				},
				{
					internalType: "address",
					name: "currency",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "pricePerToken",
					type: "uint256"
				}
			],
			internalType: "struct ISequenceMarketStorage.RequestParams[]",
			name: "requests",
			type: "tuple[]"
		}],
		name: "createRequestBatch",
		outputs: [{
			internalType: "uint256[]",
			name: "requestIds",
			type: "uint256[]"
		}],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "",
			type: "address"
		}],
		name: "customRoyalties",
		outputs: [{
			internalType: "address",
			name: "recipient",
			type: "address"
		}, {
			internalType: "uint96",
			name: "fee",
			type: "uint96"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "requestId",
			type: "uint256"
		}],
		name: "getRequest",
		outputs: [{
			components: [
				{
					internalType: "address",
					name: "creator",
					type: "address"
				},
				{
					internalType: "bool",
					name: "isListing",
					type: "bool"
				},
				{
					internalType: "bool",
					name: "isERC1155",
					type: "bool"
				},
				{
					internalType: "address",
					name: "tokenContract",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "quantity",
					type: "uint256"
				},
				{
					internalType: "uint96",
					name: "expiry",
					type: "uint96"
				},
				{
					internalType: "address",
					name: "currency",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "pricePerToken",
					type: "uint256"
				}
			],
			internalType: "struct ISequenceMarketStorage.Request",
			name: "request",
			type: "tuple"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256[]",
			name: "requestIds",
			type: "uint256[]"
		}],
		name: "getRequestBatch",
		outputs: [{
			components: [
				{
					internalType: "address",
					name: "creator",
					type: "address"
				},
				{
					internalType: "bool",
					name: "isListing",
					type: "bool"
				},
				{
					internalType: "bool",
					name: "isERC1155",
					type: "bool"
				},
				{
					internalType: "address",
					name: "tokenContract",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "quantity",
					type: "uint256"
				},
				{
					internalType: "uint96",
					name: "expiry",
					type: "uint96"
				},
				{
					internalType: "address",
					name: "currency",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "pricePerToken",
					type: "uint256"
				}
			],
			internalType: "struct ISequenceMarketStorage.Request[]",
			name: "requests",
			type: "tuple[]"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenContract",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "cost",
				type: "uint256"
			}
		],
		name: "getRoyaltyInfo",
		outputs: [{
			internalType: "address",
			name: "recipient",
			type: "address"
		}, {
			internalType: "uint256",
			name: "royalty",
			type: "uint256"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256",
			name: "requestId",
			type: "uint256"
		}, {
			internalType: "uint256",
			name: "quantity",
			type: "uint256"
		}],
		name: "isRequestValid",
		outputs: [{
			internalType: "bool",
			name: "valid",
			type: "bool"
		}, {
			components: [
				{
					internalType: "address",
					name: "creator",
					type: "address"
				},
				{
					internalType: "bool",
					name: "isListing",
					type: "bool"
				},
				{
					internalType: "bool",
					name: "isERC1155",
					type: "bool"
				},
				{
					internalType: "address",
					name: "tokenContract",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "quantity",
					type: "uint256"
				},
				{
					internalType: "uint96",
					name: "expiry",
					type: "uint96"
				},
				{
					internalType: "address",
					name: "currency",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "pricePerToken",
					type: "uint256"
				}
			],
			internalType: "struct ISequenceMarketStorage.Request",
			name: "request",
			type: "tuple"
		}],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [{
			internalType: "uint256[]",
			name: "requestIds",
			type: "uint256[]"
		}, {
			internalType: "uint256[]",
			name: "quantities",
			type: "uint256[]"
		}],
		name: "isRequestValidBatch",
		outputs: [{
			internalType: "bool[]",
			name: "valid",
			type: "bool[]"
		}, {
			components: [
				{
					internalType: "address",
					name: "creator",
					type: "address"
				},
				{
					internalType: "bool",
					name: "isListing",
					type: "bool"
				},
				{
					internalType: "bool",
					name: "isERC1155",
					type: "bool"
				},
				{
					internalType: "address",
					name: "tokenContract",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "tokenId",
					type: "uint256"
				},
				{
					internalType: "uint256",
					name: "quantity",
					type: "uint256"
				},
				{
					internalType: "uint96",
					name: "expiry",
					type: "uint96"
				},
				{
					internalType: "address",
					name: "currency",
					type: "address"
				},
				{
					internalType: "uint256",
					name: "pricePerToken",
					type: "uint256"
				}
			],
			internalType: "struct ISequenceMarketStorage.Request[]",
			name: "requests",
			type: "tuple[]"
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
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenContract",
				type: "address"
			},
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint96",
				name: "fee",
				type: "uint96"
			}
		],
		name: "setRoyaltyInfo",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [{
			internalType: "address",
			name: "newOwner",
			type: "address"
		}],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	}
];

//#endregion
//#region src/utils/abi/marketplace/sequence-marketplace-v2.ts
const SequenceMarketplaceV2_ABI = [
	{
		type: "constructor",
		inputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "acceptRequest",
		inputs: [
			{
				name: "requestId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "quantity",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "recipient",
				type: "address",
				internalType: "address"
			},
			{
				name: "additionalFees",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "additionalFeeRecipients",
				type: "address[]",
				internalType: "address[]"
			}
		],
		outputs: [],
		stateMutability: "payable"
	},
	{
		type: "function",
		name: "acceptRequestBatch",
		inputs: [
			{
				name: "requestIds",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "quantities",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "recipients",
				type: "address[]",
				internalType: "address[]"
			},
			{
				name: "additionalFees",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "additionalFeeRecipients",
				type: "address[]",
				internalType: "address[]"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "cancelRequest",
		inputs: [{
			name: "requestId",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "cancelRequestBatch",
		inputs: [{
			name: "requestIds",
			type: "uint256[]",
			internalType: "uint256[]"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "createRequest",
		inputs: [{
			name: "request",
			type: "tuple",
			internalType: "struct ISequenceMarketStorage.RequestParams",
			components: [
				{
					name: "isListing",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "isERC1155",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "tokenContract",
					type: "address",
					internalType: "address"
				},
				{
					name: "tokenId",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "quantity",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "expiry",
					type: "uint96",
					internalType: "uint96"
				},
				{
					name: "currency",
					type: "address",
					internalType: "address"
				},
				{
					name: "pricePerToken",
					type: "uint256",
					internalType: "uint256"
				}
			]
		}],
		outputs: [{
			name: "requestId",
			type: "uint256",
			internalType: "uint256"
		}],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "createRequestBatch",
		inputs: [{
			name: "requests",
			type: "tuple[]",
			internalType: "struct ISequenceMarketStorage.RequestParams[]",
			components: [
				{
					name: "isListing",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "isERC1155",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "tokenContract",
					type: "address",
					internalType: "address"
				},
				{
					name: "tokenId",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "quantity",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "expiry",
					type: "uint96",
					internalType: "uint96"
				},
				{
					name: "currency",
					type: "address",
					internalType: "address"
				},
				{
					name: "pricePerToken",
					type: "uint256",
					internalType: "uint256"
				}
			]
		}],
		outputs: [{
			name: "requestIds",
			type: "uint256[]",
			internalType: "uint256[]"
		}],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "customRoyalties",
		inputs: [{
			name: "",
			type: "address",
			internalType: "address"
		}],
		outputs: [{
			name: "recipient",
			type: "address",
			internalType: "address"
		}, {
			name: "fee",
			type: "uint96",
			internalType: "uint96"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "getRequest",
		inputs: [{
			name: "requestId",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [{
			name: "request",
			type: "tuple",
			internalType: "struct ISequenceMarketStorage.Request",
			components: [
				{
					name: "creator",
					type: "address",
					internalType: "address"
				},
				{
					name: "isListing",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "isERC1155",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "tokenContract",
					type: "address",
					internalType: "address"
				},
				{
					name: "tokenId",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "quantity",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "expiry",
					type: "uint96",
					internalType: "uint96"
				},
				{
					name: "currency",
					type: "address",
					internalType: "address"
				},
				{
					name: "pricePerToken",
					type: "uint256",
					internalType: "uint256"
				}
			]
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "getRequestBatch",
		inputs: [{
			name: "requestIds",
			type: "uint256[]",
			internalType: "uint256[]"
		}],
		outputs: [{
			name: "requests",
			type: "tuple[]",
			internalType: "struct ISequenceMarketStorage.Request[]",
			components: [
				{
					name: "creator",
					type: "address",
					internalType: "address"
				},
				{
					name: "isListing",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "isERC1155",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "tokenContract",
					type: "address",
					internalType: "address"
				},
				{
					name: "tokenId",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "quantity",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "expiry",
					type: "uint96",
					internalType: "uint96"
				},
				{
					name: "currency",
					type: "address",
					internalType: "address"
				},
				{
					name: "pricePerToken",
					type: "uint256",
					internalType: "uint256"
				}
			]
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "getRoyaltyInfo",
		inputs: [
			{
				name: "tokenContract",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "cost",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [{
			name: "recipient",
			type: "address",
			internalType: "address"
		}, {
			name: "royalty",
			type: "uint256",
			internalType: "uint256"
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "initialize",
		inputs: [{
			name: "_owner",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "invalidBeforeId",
		inputs: [{
			name: "",
			type: "address",
			internalType: "address"
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
		name: "invalidTokenBeforeId",
		inputs: [{
			name: "",
			type: "address",
			internalType: "address"
		}, {
			name: "",
			type: "address",
			internalType: "address"
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
		name: "invalidateRequests",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "invalidateRequests",
		inputs: [{
			name: "tokenContract",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "isRequestValid",
		inputs: [{
			name: "requestId",
			type: "uint256",
			internalType: "uint256"
		}, {
			name: "quantity",
			type: "uint256",
			internalType: "uint256"
		}],
		outputs: [{
			name: "valid",
			type: "bool",
			internalType: "bool"
		}, {
			name: "request",
			type: "tuple",
			internalType: "struct ISequenceMarketStorage.Request",
			components: [
				{
					name: "creator",
					type: "address",
					internalType: "address"
				},
				{
					name: "isListing",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "isERC1155",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "tokenContract",
					type: "address",
					internalType: "address"
				},
				{
					name: "tokenId",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "quantity",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "expiry",
					type: "uint96",
					internalType: "uint96"
				},
				{
					name: "currency",
					type: "address",
					internalType: "address"
				},
				{
					name: "pricePerToken",
					type: "uint256",
					internalType: "uint256"
				}
			]
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "isRequestValidBatch",
		inputs: [{
			name: "requestIds",
			type: "uint256[]",
			internalType: "uint256[]"
		}, {
			name: "quantities",
			type: "uint256[]",
			internalType: "uint256[]"
		}],
		outputs: [{
			name: "valid",
			type: "bool[]",
			internalType: "bool[]"
		}, {
			name: "requests",
			type: "tuple[]",
			internalType: "struct ISequenceMarketStorage.Request[]",
			components: [
				{
					name: "creator",
					type: "address",
					internalType: "address"
				},
				{
					name: "isListing",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "isERC1155",
					type: "bool",
					internalType: "bool"
				},
				{
					name: "tokenContract",
					type: "address",
					internalType: "address"
				},
				{
					name: "tokenId",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "quantity",
					type: "uint256",
					internalType: "uint256"
				},
				{
					name: "expiry",
					type: "uint96",
					internalType: "uint96"
				},
				{
					name: "currency",
					type: "address",
					internalType: "address"
				},
				{
					name: "pricePerToken",
					type: "uint256",
					internalType: "uint256"
				}
			]
		}],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "owner",
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
		name: "proxiableUUID",
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
		name: "renounceOwnership",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setRoyaltyInfo",
		inputs: [
			{
				name: "tokenContract",
				type: "address",
				internalType: "address"
			},
			{
				name: "recipient",
				type: "address",
				internalType: "address"
			},
			{
				name: "fee",
				type: "uint96",
				internalType: "uint96"
			}
		],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "transferOwnership",
		inputs: [{
			name: "newOwner",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "upgradeTo",
		inputs: [{
			name: "newImplementation",
			type: "address",
			internalType: "address"
		}],
		outputs: [],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "upgradeToAndCall",
		inputs: [{
			name: "newImplementation",
			type: "address",
			internalType: "address"
		}, {
			name: "data",
			type: "bytes",
			internalType: "bytes"
		}],
		outputs: [],
		stateMutability: "payable"
	},
	{
		type: "event",
		name: "AdminChanged",
		inputs: [{
			name: "previousAdmin",
			type: "address",
			indexed: false,
			internalType: "address"
		}, {
			name: "newAdmin",
			type: "address",
			indexed: false,
			internalType: "address"
		}],
		anonymous: false
	},
	{
		type: "event",
		name: "BeaconUpgraded",
		inputs: [{
			name: "beacon",
			type: "address",
			indexed: true,
			internalType: "address"
		}],
		anonymous: false
	},
	{
		type: "event",
		name: "CustomRoyaltyChanged",
		inputs: [
			{
				name: "tokenContract",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "recipient",
				type: "address",
				indexed: false,
				internalType: "address"
			},
			{
				name: "fee",
				type: "uint96",
				indexed: false,
				internalType: "uint96"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Initialized",
		inputs: [{
			name: "version",
			type: "uint8",
			indexed: false,
			internalType: "uint8"
		}],
		anonymous: false
	},
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [{
			name: "previousOwner",
			type: "address",
			indexed: true,
			internalType: "address"
		}, {
			name: "newOwner",
			type: "address",
			indexed: true,
			internalType: "address"
		}],
		anonymous: false
	},
	{
		type: "event",
		name: "RequestAccepted",
		inputs: [
			{
				name: "requestId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "buyer",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "tokenContract",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "recipient",
				type: "address",
				indexed: false,
				internalType: "address"
			},
			{
				name: "quantity",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "quantityRemaining",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "RequestCancelled",
		inputs: [{
			name: "requestId",
			type: "uint256",
			indexed: true,
			internalType: "uint256"
		}, {
			name: "tokenContract",
			type: "address",
			indexed: true,
			internalType: "address"
		}],
		anonymous: false
	},
	{
		type: "event",
		name: "RequestCreated",
		inputs: [
			{
				name: "requestId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "creator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "tokenContract",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "isListing",
				type: "bool",
				indexed: false,
				internalType: "bool"
			},
			{
				name: "quantity",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "currency",
				type: "address",
				indexed: false,
				internalType: "address"
			},
			{
				name: "pricePerToken",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "expiry",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "RequestsInvalidated",
		inputs: [{
			name: "creator",
			type: "address",
			indexed: true,
			internalType: "address"
		}, {
			name: "invalidatedBefore",
			type: "uint256",
			indexed: true,
			internalType: "uint256"
		}],
		anonymous: false
	},
	{
		type: "event",
		name: "RequestsInvalidated",
		inputs: [
			{
				name: "creator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "tokenContract",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "invalidatedBefore",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Upgraded",
		inputs: [{
			name: "implementation",
			type: "address",
			indexed: true,
			internalType: "address"
		}],
		anonymous: false
	},
	{
		type: "error",
		name: "InvalidAdditionalFees",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidBatchRequest",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidCurrency",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidCurrencyApproval",
		inputs: [
			{
				name: "currency",
				type: "address",
				internalType: "address"
			},
			{
				name: "quantity",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "owner",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "InvalidExpiry",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidPrice",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidQuantity",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidRequestId",
		inputs: [{
			name: "requestId",
			type: "uint256",
			internalType: "uint256"
		}]
	},
	{
		type: "error",
		name: "InvalidRoyalty",
		inputs: []
	},
	{
		type: "error",
		name: "InvalidTokenApproval",
		inputs: [
			{
				name: "tokenContract",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "quantity",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "owner",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "Invalidated",
		inputs: []
	},
	{
		type: "error",
		name: "UnsupportedContractInterface",
		inputs: [{
			name: "contractAddress",
			type: "address",
			internalType: "address"
		}, {
			name: "interfaceId",
			type: "bytes4",
			internalType: "bytes4"
		}]
	}
];

//#endregion
export { SequenceMarketplaceV1_ABI as n, EIP2981_ABI as r, SequenceMarketplaceV2_ABI as t };
//# sourceMappingURL=marketplace.js.map