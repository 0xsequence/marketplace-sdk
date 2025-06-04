import { ContractType } from '../../../../_internal';

export const getSupplyStatusText = ({
	quantityInitial,
	quantityRemaining,
	collectionType,
}: {
	quantityInitial: string | undefined;
	quantityRemaining: string | undefined;
	collectionType: ContractType;
}): string => {
	const hasUnlimitedSupplyCap =
		quantityInitial === Number.POSITIVE_INFINITY.toString();

	if (hasUnlimitedSupplyCap) {
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
		!hasUnlimitedSupplyCap &&
		quantityRemaining === '0'
	) {
		return 'Out of stock';
	}

	if (quantityRemaining && Number(quantityRemaining) > 0) {
		return `Supply: ${quantityRemaining}`;
	}

	return 'Out of stock';
};
