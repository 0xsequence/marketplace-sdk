import { Container, Divider, Heading, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import type { Address } from 'viem';
import { CollectionSelector } from './components/CollectionSelector';
import { MarketplaceListingsTable } from './components/MarketplaceListingsTable';

function App() {
	const [selectedCollection, setSelectedCollection] = useState<Address | null>(
		null,
	);
	const [selectedCollectionData, setSelectedCollectionData] =
		useState<any>(null);

	return (
		<Container maxW="container.xl" py={8}>
			<VStack spacing={6} align="stretch">
				<Heading size="lg">Marketplace Listings</Heading>

				<CollectionSelector
					selectedCollection={selectedCollection}
					onCollectionChange={(address) =>
						setSelectedCollection(address as Address)
					}
					onCollectionDataChange={setSelectedCollectionData}
				/>

				<Divider />

				{selectedCollection && selectedCollectionData && (
					<MarketplaceListingsTable
						collectionAddress={selectedCollection}
						chainId={selectedCollectionData.chainId}
					/>
				)}
			</VStack>
		</Container>
	);
}

export default App;
