import {
	Card,
	CollectionIcon,
	Text,
	truncateAddress,
} from '@0xsequence/design-system';
import type { ContractInfo } from '@0xsequence/marketplace-sdk';
import { ContractType } from '@0xsequence/marketplace-sdk';
import { Media } from '@0xsequence/marketplace-sdk/react';
import { NetworkPill } from './NetworkPill';

export interface CollectionCardProps {
	collection: ContractInfo;
	onClick: () => void;
}

export function CollectionCard({ collection, onClick }: CollectionCardProps) {
	const truncatedAddress = truncateAddress(collection.address, 4);
	const contractType = collection.type;

	return (
		<Card
			className="group relative aspect-square overflow-hidden border border-background-secondary p-0 transition-all duration-200 hover:shadow-lg"
			key={collection.address}
			onClick={onClick}
			style={{ cursor: 'pointer' }}
		>
			<NetworkPill chainId={collection.chainId as number} />

			{contractType === ContractType.ERC1155 && (
				<div className="absolute top-0 right-0 z-30">
					<Text
						variant="small"
						color="text50"
						className="flex items-center bg-background-primary p-2"
					>
						ERC1155
					</Text>
				</div>
			)}

			{contractType === ContractType.ERC721 && (
				<div className="absolute top-0 right-0 z-30">
					<Text
						variant="small"
						color="text50"
						className="flex items-center bg-background-primary p-2"
					>
						ERC721
					</Text>
				</div>
			)}
			<Media
				assets={[collection.extensions.ogImage]}
				className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
			/>

			<div className="absolute right-0 bottom-0 left-0 flex items-center bg-background-primary bg-opacity-80 p-4 backdrop-blur-sm">
				<Media
					assets={[collection.logoURI]}
					className="mr-2 h-auto w-10 rounded-full"
					fallbackContent={<CollectionIcon className="text-text-50" />}
				/>
				<div>
					<Text variant="large" fontWeight="bold" className="mb-1 line-clamp-1">
						{collection.name || 'Unnamed Collection'}
					</Text>

					<Text variant="small" color="text50" className="flex items-center">
						{truncatedAddress}
					</Text>
				</div>
			</div>
		</Card>
	);
}
