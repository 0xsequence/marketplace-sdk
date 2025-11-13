import { ContractType } from '../../../../_internal';

export const getSupplyStatusText = ({
	quantityRemaining,
	collectionType,
	unlimitedSupply,
}: {
	quantityRemaining: bigint | undefined;
	collectionType: ContractType;
	unlimitedSupply?: boolean;
}): string => {
	if (unlimitedSupply) {
		return 'Unlimited Supply';
	}

	if (
		collectionType === ContractType.ERC721 &&
		quantityRemaining === undefined
	) {
		return 'Out of stock';
	}

	if (
		collectionType === ContractType.ERC1155 &&
		!unlimitedSupply &&
		quantityRemaining === 0n
	) {
		return 'Out of stock';
	}

	if (quantityRemaining && quantityRemaining > 0n) {
		return `Supply: ${quantityRemaining.toString()}`;
	}

	return 'Out of stock';
};
