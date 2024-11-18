import { Box, NetworkImage, Skeleton, Text } from '@0xsequence/design-system';
import { formatDistanceToNow } from 'date-fns';

type TransactionHeaderProps = {
	title: string;
	chainId: number;
	date?: Date;
};

export default function TransactionHeader({
	title,
	chainId,
	date,
}: TransactionHeaderProps) {
	return (
		<Box display="flex" alignItems="center" width="full">
			<Text fontSize="small" fontWeight="medium" color="text80" marginRight="1">
				{title}
			</Text>

			<NetworkImage size="xs" chainId={chainId} />

			{(date && (
				<Text fontSize="small" color="text50" flexGrow="1" textAlign="right">
					{formatDistanceToNow(date)} ago
				</Text>
			)) || <Skeleton width="8" height="4" />}
		</Box>
	);
}
