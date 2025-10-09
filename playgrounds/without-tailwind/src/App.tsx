import { Container, Heading, Separator, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { CollectionSelector } from './components/CollectionSelector';
import { MarketplaceListingsTable } from './components/MarketplaceListingsTable';
import type { Collection } from './types';

function App() {
	const [selectedCollection, setSelectedCollection] =
		useState<Collection | null>(null);

	return (
		<Container maxW="container.xl" py={8}>
			<VStack gap={6} align="stretch">
				<Heading size="lg">Marketplace Listings</Heading>

				<CollectionSelector
					selectedCollection={selectedCollection}
					onCollectionChange={(collection) => setSelectedCollection(collection)}
				/>

				<Separator />

				{selectedCollection && (
					<MarketplaceListingsTable collection={selectedCollection} />
				)}
			</VStack>
		</Container>
	);
}

export default App;
