import { Text } from '@0xsequence/design-system';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

type TimeAgoProps = {
	date: Date;
};

export default function TimeAgo({ date }: TimeAgoProps) {
	const [timeAgo, setTimeAgo] = useState<string>('');

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeAgo(formatDistanceToNow(date));
		}, 1000);

		return () => clearInterval(interval);
	}, [date]);

	return (
		<div className="flex grow items-center justify-end">
			<Text className="text-sm" color="text50">
				{timeAgo}
			</Text>
		</div>
	);
}
