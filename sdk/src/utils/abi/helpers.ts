import type { SalesContractVersion } from '../../react/hooks/contracts/useSalesContractABI';
import {
	SequenceMarketplaceV1_ABI,
	SequenceMarketplaceV2_ABI,
} from './marketplace';
import {
	ERC721_SALE_ABI_V0,
	ERC721_SALE_ABI_V1,
	ERC1155_SALES_CONTRACT_ABI_V0,
	ERC1155_SALES_CONTRACT_ABI_V1,
} from './primary-sale';

/**
 * Get the appropriate sales contract ABI based on token type and version
 */
export const getSaleContractABI = (
	tokenType: 'ERC721' | 'ERC1155',
	version: SalesContractVersion,
) => {
	const abiMap = {
		'ERC721-v0': ERC721_SALE_ABI_V0,
		'ERC721-v1': ERC721_SALE_ABI_V1,
		'ERC1155-v0': ERC1155_SALES_CONTRACT_ABI_V0,
		'ERC1155-v1': ERC1155_SALES_CONTRACT_ABI_V1,
	} as const;

	const key = `${tokenType}-${version}` as keyof typeof abiMap;
	return abiMap[key];
};

/**
 * Get the appropriate marketplace ABI based on version
 */
export const getMarketplaceABI = (version: 'v1' | 'v2') => {
	return version === 'v1'
		? SequenceMarketplaceV1_ABI
		: SequenceMarketplaceV2_ABI;
};
