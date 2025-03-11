'use client';

import { usePlayground } from '@/lib/PlaygroundContext';
import { ROUTES } from '@/lib/routes';
import { Card, NetworkImage, Text } from '@0xsequence/design-system';
import type { ContractInfo } from '@0xsequence/indexer';
import { getNetwork } from '@0xsequence/kit';
import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { useRouter } from 'next/navigation';
import type { Hex } from 'viem';

function NetworkPill({ chainId }: { chainId: number }) {
	const network = getNetwork(chainId);
	return (
		<div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background-primary px-2 py-1">
			<Text variant="small" color="text80" fontWeight="bold">
				{network.name}
			</Text>
			<NetworkImage chainId={chainId} size="xs" />
		</div>
	);
}

export default function CollectionsPage() {
	const router = useRouter();
	const { data: collections, isLoading } = useListCollections();
	const { setChainId, setCollectionAddress } = usePlayground();

	const handleCollectionClick = (collection: ContractInfo) => {
		setChainId(String(collection.chainId));
		setCollectionAddress(collection.address as Hex);
		router.push(`/${ROUTES.COLLECTIBLES.path}`);
	};

	if (collections?.length === 0 && !isLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collections found</Text>
			</div>
		);
	}

	return (
		<div
			className="flex gap-3 pt-2"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '16px',
			}}
		>
			{isLoading ? (
				<div className="flex justify-center">
					<Text variant="large">Loading collections...</Text>
				</div>
			) : (
				<>
					{collections?.map((collection: Partial<ContractInfo>) => (
						<Card
							className="relative flex gap-2 transition-all duration-300 hover:bg-background-raised/40"
							key={collection.address}
							onClick={() => handleCollectionClick(collection as ContractInfo)}
							style={{ cursor: 'pointer' }}
						>
							<NetworkPill chainId={collection.chainId as number} />
							<div
								className="flex items-center"
								style={{
									backgroundImage: `url(${collection.extensions?.ogImage || '/placeholder-collection.jpg'})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									minHeight: '200px',
									minWidth: '90px',
								}}
							>
								<Card className="flex flex-col gap-1" blur={true}>
									<Text variant="large">
										{collection.name || 'Unnamed Collection'}
									</Text>
									<Text variant="small">
										{collection.address?.substring(0, 8)}...
										{collection.address?.substring(
											collection.address.length - 6,
										)}
									</Text>
								</Card>
							</div>
						</Card>
					))}
				</>
			)}
		</div>
	);
}
