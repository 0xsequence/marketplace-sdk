export const EIP2981_ABI = [
	{
		inputs: [
			{ internalType: 'uint256', name: '', type: 'uint256' },
			{ internalType: 'uint256', name: '_saleCost', type: 'uint256' },
		],
		name: 'royaltyInfo',
		outputs: [
			{ internalType: 'address', name: 'receiver', type: 'address' },
			{ internalType: 'uint256', name: 'royaltyAmount', type: 'uint256' },
		],
		stateMutability: 'view',
		type: 'function',
	},
] as const;
