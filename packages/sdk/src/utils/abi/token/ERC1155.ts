export const ERC1155_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: '_operator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: '_approved',
				type: 'bool',
			},
		],
		name: 'ApprovalForAll',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_operator',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: '_from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: '_to',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256[]',
				name: '_ids',
				type: 'uint256[]',
			},
			{
				indexed: false,
				internalType: 'uint256[]',
				name: '_amounts',
				type: 'uint256[]',
			},
		],
		name: 'TransferBatch',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_operator',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: '_from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: '_to',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_id',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
		],
		name: 'TransferSingle',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_owner',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_id',
				type: 'uint256',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: '_owners',
				type: 'address[]',
			},
			{
				internalType: 'uint256[]',
				name: '_ids',
				type: 'uint256[]',
			},
		],
		name: 'balanceOfBatch',
		outputs: [
			{
				internalType: 'uint256[]',
				name: '',
				type: 'uint256[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_id',
				type: 'uint256',
			},
		],
		name: 'getIDBinIndex',
		outputs: [
			{
				internalType: 'uint256',
				name: 'bin',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'index',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_binValues',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_index',
				type: 'uint256',
			},
		],
		name: 'getValueInBin',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_operator',
				type: 'address',
			},
		],
		name: 'isApprovedForAll',
		outputs: [
			{
				internalType: 'bool',
				name: 'isOperator',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_to',
				type: 'address',
			},
			{
				internalType: 'uint256[]',
				name: '_ids',
				type: 'uint256[]',
			},
			{
				internalType: 'uint256[]',
				name: '_amounts',
				type: 'uint256[]',
			},
			{
				internalType: 'bytes',
				name: '_data',
				type: 'bytes',
			},
		],
		name: 'safeBatchTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_id',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: '_data',
				type: 'bytes',
			},
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_operator',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: '_approved',
				type: 'bool',
			},
		],
		name: 'setApprovalForAll',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes4',
				name: '_interfaceID',
				type: 'bytes4',
			},
		],
		name: 'supportsInterface',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
] as const;
