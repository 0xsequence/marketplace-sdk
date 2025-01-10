import { Card, Text } from '@0xsequence/design-system';

export interface CollectibleDetailsProps {
	name?: string;
	id: string;
	balance?: number;
}

export const CollectibleDetails = ({
	name,
	id,
	balance = 0,
}: CollectibleDetailsProps) => {
	return (
		<Card gap="3" flexDirection="column">
			<Text variant="large">Collectible Details</Text>
			<Text>{`Name: ${name}`}</Text>
			<Text>{`ID: ${id}`}</Text>
			<Text>{`You own: ${balance} of this collectible`}</Text>
		</Card>
	);
};
