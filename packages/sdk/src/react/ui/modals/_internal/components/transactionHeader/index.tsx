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
		<div className="flex items-center w-full">
			<Text
				className="text-sm mr-1 font-body"
				fontWeight="medium"
				color="text80"
			>
				{title}
			</Text>
			<Image className="w-3 h-3 mr-1" src={currencyImageUrl} />
			{(date && (
				<Text className="text-sm grow text-right font-body" color="text50">
					{formatDistanceToNow(date)} ago
				</Text>
			)) || <Skeleton className="w-8 h-4" />}
		</div>
	);
}
