import {
	Card,
	capitalize,
	Separator,
	Skeleton,
	Text,
} from '@0xsequence/design-system';
import type { ContractInfo, TokenMetadata } from '@0xsequence/marketplace-sdk';
import { cn } from '@0xsequence/marketplace-sdk';
import {
	processAttributes,
	processProperties,
	type StandardizedAttribute,
	type StandardizedProperty,
	useHighestOffer,
	useLowestListing,
	useMarketCurrencies,
} from '@0xsequence/marketplace-sdk/react';

export interface CollectibleDetailsProps {
	name?: string;
	id: bigint;
	balance?: number;
	chainId: number;
	collection: ContractInfo | undefined;
	onCollectionClick: () => void;
	cardType?: 'market' | 'shop';
	collectible: TokenMetadata | undefined;
}

export const CollectibleDetails = ({
	name,
	id,
	balance = 0,
	chainId,
	collection,
	onCollectionClick,
	cardType = 'market',
	collectible,
}: CollectibleDetailsProps) => {
	const isMarket = cardType === 'market';

	const { data: lowestListing } = useLowestListing({
		collectionAddress: collection?.address,
		chainId,
		tokenId: id,
		query: {
			enabled: isMarket,
		},
	});
	const { data: highestOffer } = useHighestOffer({
		collectionAddress: collection?.address,
		chainId,
		tokenId: id,
		query: {
			enabled: isMarket,
		},
	});
	const { data: currencies } = useMarketCurrencies({
		chainId,
	});

	return (
		<Card className="flex-1 rounded-xl border border-border-base bg-background-secondary p-6 shadow-lg">
			<div className="space-y-6">
				<button
					type="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							onCollectionClick();
						}
					}}
					aria-label={`View ${collection?.name} collection`}
					onClick={onCollectionClick}
					className="flex items-center gap-2 rounded-md bg-background-control px-2 py-1"
				>
					{(collection?.logoURI && (
						<img
							src={collection?.logoURI}
							alt={collection?.name}
							className={cn(
								'h-4 w-4 rounded-full',
								collection?.logoURI ? 'block' : 'hidden',
							)}
						/>
					)) ||
						'<'}

					<Text className="font-medium text-sm text-text-100">
						{collection?.name}
					</Text>
				</button>

				<Separator className="my-2" />

				{/* Basic Info Section */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Text className="font-medium text-sm text-text-50">Name</Text>
						<Text className="font-medium text-text-100">
							{name || 'Unnamed'}
						</Text>
					</div>
					<div className="flex items-center justify-between">
						<Text className="font-medium text-sm text-text-50">ID</Text>
						<Text className="font-medium font-mono text-text-100">{id}</Text>
					</div>
					{isMarket && (
						<div className="flex items-center justify-between">
							<Text className="font-medium text-sm text-text-50">
								Your Balance
							</Text>
							<Text className="font-medium text-text-100">{balance} items</Text>
						</div>
					)}
				</div>

				<PropertiesContent
					tokenMetadata={collectible}
					isLoading={!collectible}
				/>

				{/* Market Info Section */}
				{isMarket && (
					<div className="space-y-4 border-border-base border-t pt-4">
						<div className="flex items-center justify-between rounded-lg bg-background-backdrop p-3">
							<Text className="font-medium text-sm text-text-50">
								Lowest Listing
							</Text>
							<Text className="font-semibold text-text-100">
								{lowestListing?.priceAmountFormatted || '—'}{' '}
								<span className="text-text-80">
									{currencies?.find(
										(c: { contractAddress: string }) =>
											c.contractAddress === lowestListing?.priceCurrencyAddress,
									)?.symbol || ''}
								</span>
							</Text>
						</div>
						<div className="flex items-center justify-between rounded-lg bg-background-backdrop p-3">
							<Text className="font-medium text-sm text-text-50">
								Highest Offer
							</Text>
							<Text className="font-semibold text-text-100">
								{highestOffer?.priceAmountFormatted || '—'}{' '}
								<span className="text-text-80">
									{currencies?.find(
										(c: { contractAddress: string }) =>
											c.contractAddress === highestOffer?.priceCurrencyAddress,
									)?.symbol || ''}
								</span>
							</Text>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
};

type PropertiesProps = {
	tokenMetadata?: TokenMetadata;
	isLoading: boolean;
};

function PropertiesContent({ tokenMetadata, isLoading }: PropertiesProps) {
	const propertiesNotSet =
		tokenMetadata?.attributes.length === 0 &&
		Object.keys(tokenMetadata?.properties || {}).length === 0 &&
		!isLoading;

	// Process attributes and properties separately
	const attributes = tokenMetadata
		? processAttributes(tokenMetadata.attributes)
		: {};
	const properties = tokenMetadata
		? processProperties(tokenMetadata.properties)
		: {};

	// Combine both for display (attributes take precedence for display_type)
	const allProperties: Record<
		string,
		StandardizedAttribute | StandardizedProperty
	> = {
		...properties,
		...attributes,
	};

	if (propertiesNotSet) {
		return (
			<Text className="font-medium text-secondary text-sm">
				No properties for this collectible
			</Text>
		);
	}

	return (
		<div className="flex gap-3 overflow-x-auto bg-background-active">
			{isLoading && <Skeleton className="h-4 w-full" />}
			{Object.entries(allProperties).map(([key, property]) => (
				<Property key={key} name={property.name} value={property.value} />
			))}
		</div>
	);
}

function Property({ name, value }: { name: string; value: string }) {
	const formattedValue = value;

	return (
		<div className="flex flex-col gap-1 rounded-xl px-3 py-2">
			<Text className="font-medium text-muted text-xs">{capitalize(name)}</Text>
			<Text className="whitespace-pre-wrap wrap-break-word font-bold text-secondary text-sm">
				{formattedValue}
			</Text>
		</div>
	);
}
