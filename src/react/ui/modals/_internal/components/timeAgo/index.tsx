import { Box, Text } from '@0xsequence/design-system';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

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
		<Box
			flexGrow="1"
			display="flex"
			alignItems="center"
			justifyContent="flex-end"
		>
			<Text color="text50" fontSize="small">
				{timeAgo}
			</Text>
		</Box>
	);
}
