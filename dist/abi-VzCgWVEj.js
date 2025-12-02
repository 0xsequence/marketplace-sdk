import { SequenceMarketplaceV1_ABI, SequenceMarketplaceV2_ABI } from "./marketplace-BYY8OloA.js";
import { ERC1155_SALES_CONTRACT_ABI_V0, ERC1155_SALES_CONTRACT_ABI_V1, ERC721_SALE_ABI_V0, ERC721_SALE_ABI_V1 } from "./primary-sale-DOmNDq2P.js";

//#region src/utils/abi/helpers.ts
/**
* Get the appropriate sales contract ABI based on token type and version
*/
const getSaleContractABI = (tokenType, version) => {
	const abiMap = {
		"ERC721-v0": ERC721_SALE_ABI_V0,
		"ERC721-v1": ERC721_SALE_ABI_V1,
		"ERC1155-v0": ERC1155_SALES_CONTRACT_ABI_V0,
		"ERC1155-v1": ERC1155_SALES_CONTRACT_ABI_V1
	};
	const key = `${tokenType}-${version}`;
	return abiMap[key];
};
/**
* Get the appropriate marketplace ABI based on version
*/
const getMarketplaceABI = (version) => {
	return version === "v1" ? SequenceMarketplaceV1_ABI : SequenceMarketplaceV2_ABI;
};

//#endregion
//#region src/utils/abi/mainModule.ts
const MAIN_MODULE_ABI = [
	{
		type: "function",
		name: "nonce",
		constant: true,
		inputs: [],
		outputs: [{ type: "uint256" }],
		payable: false,
		stateMutability: "view"
	},
	{
		type: "function",
		name: "readNonce",
		constant: true,
		inputs: [{ type: "uint256" }],
		outputs: [{ type: "uint256" }],
		payable: false,
		stateMutability: "view"
	},
	{
		type: "function",
		name: "updateImplementation",
		constant: false,
		inputs: [{ type: "address" }],
		outputs: [],
		payable: false,
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "selfExecute",
		constant: false,
		inputs: [{
			components: [
				{
					type: "bool",
					name: "delegateCall"
				},
				{
					type: "bool",
					name: "revertOnError"
				},
				{
					type: "uint256",
					name: "gasLimit"
				},
				{
					type: "address",
					name: "target"
				},
				{
					type: "uint256",
					name: "value"
				},
				{
					type: "bytes",
					name: "data"
				}
			],
			type: "tuple[]"
		}],
		outputs: [],
		payable: false,
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "execute",
		constant: false,
		inputs: [
			{
				components: [
					{
						type: "bool",
						name: "delegateCall"
					},
					{
						type: "bool",
						name: "revertOnError"
					},
					{
						type: "uint256",
						name: "gasLimit"
					},
					{
						type: "address",
						name: "target"
					},
					{
						type: "uint256",
						name: "value"
					},
					{
						type: "bytes",
						name: "data"
					}
				],
				type: "tuple[]"
			},
			{ type: "uint256" },
			{ type: "bytes" }
		],
		outputs: [],
		payable: false,
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "createContract",
		inputs: [{ type: "bytes" }],
		payable: true,
		stateMutability: "payable"
	},
	{
		type: "function",
		name: "setExtraImageHash",
		constant: false,
		inputs: [{
			type: "bytes32",
			name: "imageHash"
		}, {
			type: "uint256",
			name: "expiration"
		}],
		outputs: [],
		payable: false,
		stateMutability: "nonpayable"
	}
];

//#endregion
export { MAIN_MODULE_ABI, getMarketplaceABI, getSaleContractABI };
//# sourceMappingURL=abi-VzCgWVEj.js.map