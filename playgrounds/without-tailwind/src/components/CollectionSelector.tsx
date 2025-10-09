import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { Field, NativeSelect } from '@chakra-ui/react';
import type { Collection } from '../types';

interface CollectionSelectorProps {
	selectedCollection: Collection | null;
	onCollectionChange: (collection: Collection) => void;
}

export function CollectionSelector({
	selectedCollection,
	onCollectionChange,
}: CollectionSelectorProps) {
	const { data: collections } = useListCollections();

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
		<Field.Root>
			<Field.Label>Select Collection</Field.Label>
			<NativeSelect.Root>
				<NativeSelect.Field
					value={selectedCollection?.address || ''}
					onChange={handleCollectionChange}
					placeholder="Choose a collection"
				>
					{collections?.map((collection) => (
						<option key={collection.address} value={collection.address}>
							{collection.name || collection.address}
						</option>
					))}
				</NativeSelect.Field>
				<NativeSelect.Indicator />
			</NativeSelect.Root>
		</Field.Root>
	);
}
