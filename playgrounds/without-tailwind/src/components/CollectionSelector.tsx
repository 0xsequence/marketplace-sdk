import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';

interface CollectionSelectorProps {
	selectedCollection: string | null;
	onCollectionChange: (collectionAddress: string) => void;
	onCollectionDataChange?: (collectionData: any) => void;
}

export function CollectionSelector({
	selectedCollection,
	onCollectionChange,
	onCollectionDataChange,
}: CollectionSelectorProps) {
	const { data: collections, isLoading } = useListCollections();

	const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const address = e.target.value;
		onCollectionChange(address);

		if (onCollectionDataChange && collections) {
			const selectedCollectionData = collections.find(
				(collection) => collection.address === address,
			);
			if (selectedCollectionData) {
				onCollectionDataChange(selectedCollectionData);
			}
		}
	};

	return (
		<FormControl>
			<FormLabel>Select Collection</FormLabel>
			<Select
				value={selectedCollection || ''}
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
