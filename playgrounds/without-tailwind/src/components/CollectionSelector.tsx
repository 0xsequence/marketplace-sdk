import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import type { Collection } from '../types';

interface CollectionSelectorProps {
	selectedCollection: Collection | null;
	onCollectionChange: (collection: Collection) => void;
}

export function CollectionSelector({
	selectedCollection,
	onCollectionChange,
}: CollectionSelectorProps) {
	const { data: collections, isLoading } = useListCollections();

	const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const address = e.target.value;

		if (collections) {
			const selectedCollectionData = collections.find(
				(collection) => collection.address === address,
			);
			if (selectedCollectionData) {
				onCollectionChange(selectedCollectionData);
			}
		}
	};

	return (
		<FormControl>
			<FormLabel>Select Collection</FormLabel>
			<Select
				value={selectedCollection?.address || ''}
				onChange={handleCollectionChange}
				placeholder="Choose a collection"
				isDisabled={isLoading}
			>
				{collections?.map((collection) => (
					<option key={collection.address} value={collection.address}>
						{collection.name || collection.address}
					</option>
				))}
			</Select>
		</FormControl>
	);
}
