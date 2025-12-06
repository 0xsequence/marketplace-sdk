import type { TokenBalance } from '@0xsequence/indexer';
import type { Order } from '@0xsequence/marketplace-sdk';
import { compareAddress } from '@0xsequence/marketplace-sdk';
import type { Address } from 'viem';

function handleOfferClick({
	balances,
	accountAddress,
	chainId,
	collectionAddress,
	order,
	showSellModal,
	e,
}: {
	balances: TokenBalance[];
	accountAddress: Address;
	chainId: number;
	collectionAddress: Address;
	order?: Order;
	showSellModal: (args: {
		chainId: number;
		collectionAddress: Address;
		tokenId: bigint;
		order?: Order;
	}) => void;
	e: React.MouseEvent<HTMLButtonElement>;
}) {
	if (!order || !order.tokenId) {
		return;
	}

	const ownedCollectible = !!balances?.find(
		(balance) => balance.tokenID === order.tokenId,
	);
	const offerMadeBySelf = compareAddress(order.createdBy, accountAddress);

	if (!ownedCollectible || offerMadeBySelf) {
		return;
	}

	e.stopPropagation();
	e.preventDefault();

	showSellModal({
		chainId,
		collectionAddress,
		tokenId: order.tokenId || 0n,
		order,
	});
}

export { handleOfferClick };
