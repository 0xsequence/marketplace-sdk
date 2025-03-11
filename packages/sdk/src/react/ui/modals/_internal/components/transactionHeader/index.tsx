import { Image, Skeleton, Text } from '@0xsequence/design-system';
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
		<div className="flex w-full items-center">
			<Text
				className="mr-1 font-body text-sm"
				fontWeight="medium"
				color="text80"
			>
				{title}
			</Text>
			<Image className="mr-1 h-3 w-3" src={currencyImageUrl} />
			{(date && (
				<Text className="grow text-right font-body text-sm" color="text50">
					{formatDistanceToNow(date)} ago
				</Text>
			)) || <Skeleton className="h-4 w-8" />}
		</div>
	);
}
