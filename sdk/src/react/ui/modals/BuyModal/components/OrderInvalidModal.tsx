'use client';

import { Text } from '@0xsequence/design-system';
import type { TokenMetadata } from '@0xsequence/metadata';
import type { Address } from 'viem';
import { useListListingsForCollectible } from '../../../../hooks/data/orders';
import type { Order } from '../../../../_internal';
import { ActionModal } from '../../_internal/components/actionModal';
import { LoadingModal } from '../../_internal/components/actionModal/LoadingModal';
import { buyModalStore } from '../store';
import { useBuyModal } from '../index';
import { AlternativeListingCard } from './AlternativeListingCard';

interface OrderInvalidModalProps {
	collectable: TokenMetadata;
	chainId: number;
	collectionAddress: Address;
	collectibleId: string;
	invalidOrder: Order;
}

export const OrderInvalidModal = ({
	collectable,
	chainId,
	collectionAddress,
	collectibleId,
	invalidOrder,
}: OrderInvalidModalProps) => {
	const { show: showBuyModal } = useBuyModal();

	const listingsQuery = useListListingsForCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});

	if (listingsQuery.isLoading) {
		return (
			<LoadingModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Finding alternatives"
			/>
		);
	}

	const listings = listingsQuery.data?.listings ?? [];
	const alternatives = listings
		.filter((order) => order.orderId !== invalidOrder.orderId)
		.sort((a, b) => (BigInt(a.priceAmount) < BigInt(b.priceAmount) ? -1 : 1))
		.slice(0, 5);

	const hasAlternatives = alternatives.length > 0;
	const isError = listingsQuery.isError;

	const handleSelectAlternative = (order: Order) => {
		buyModalStore.send({ type: 'close' });

		setTimeout(() => {
			showBuyModal({
				chainId,
				collectionAddress,
				collectibleId,
				orderId: order.orderId,
				marketplace: order.marketplace,
			});
		}, 100);
	};

	return (
		<ActionModal
			isOpen={true}
			chainId={chainId}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Order No Longer Available"
			ctas={[
				{
					label: 'Close',
					onClick: () => buyModalStore.send({ type: 'close' }),
					variant: 'glass',
				},
			]}
		>
			<div className="flex w-full flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Text className="text-center font-body text-sm text-text-80">
						This listing is no longer available. It may have been sold,
						cancelled, or expired.
					</Text>
				</div>

				{hasAlternatives ? (
					<div className="flex flex-col gap-3">
						<Text className="font-body font-bold text-sm text-text-100">
							Alternative Listings
						</Text>
						<ul className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
							{alternatives.map((order) => (
								<li key={order.orderId}>
									<AlternativeListingCard
										order={order}
										collectable={collectable}
										onSelect={() => handleSelectAlternative(order)}
									/>
								</li>
							))}
						</ul>
					</div>
				) : (
					<div className="flex flex-col gap-2 rounded-lg border border-border-normal bg-surface-raised p-4">
						<Text className="text-center font-body text-sm text-text-80">
							No alternative listings are currently available for this item.
						</Text>
					</div>
				)}

				{isError && (
					<Text className="text-center font-body text-text-50 text-xs">
						Unable to load alternative listings
					</Text>
				)}
			</div>
		</ActionModal>
	);
};
