import { ContractType } from '../../../../_internal';

export const getSupplyStatusText = ({
	quantityRemaining,
	collectionType,
	unlimitedSupply,
}: {
	quantityRemaining: string | undefined;
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
		quantityRemaining === '0'
	) {
		return 'Out of stock';
	}

	if (quantityRemaining && Number(quantityRemaining) > 0) {
		return `Supply: ${quantityRemaining}`;
	}

	return 'Out of stock';
};
