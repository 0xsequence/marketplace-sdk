import { Box, Image, Skeleton, Text } from '@0xsequence/design-system';
import { formatDistanceToNow } from 'date-fns';

type TransactionHeaderProps = {
	title: string;
	currencyImageUrl?: string;
	date?: Date;
};

export default function TransactionHeader({
	title,
	currencyImageUrl,
	date,
}: TransactionHeaderProps) {
	return (
		<Box display="flex" alignItems="center" width="full">
			<Text
				fontSize="small"
				fontWeight="medium"
				color="text80"
				marginRight="1"
				fontFamily="body"
			>
				{title}
			</Text>

			<Image src={currencyImageUrl} width="3" height="3" marginRight="1" />

			{(date && (
				<Text
					fontSize="small"
					color="text50"
					flexGrow="1"
					textAlign="right"
					fontFamily="body"
				>
					{formatDistanceToNow(date)} ago
				</Text>
			)) || <Skeleton width="8" height="4" />}
		</Box>
	);
}
