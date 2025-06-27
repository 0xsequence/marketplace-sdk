'use client';

import { Text } from '@0xsequence/design-system';

interface BalanceErrorProps {
	show: boolean;
	message?: string;
}

export default function BalanceError({
	show,
	message = 'Insufficient balance',
}: BalanceErrorProps) {
	if (!show) return null;

	return (
		<Text
			className="-bottom-5 absolute font-body font-medium text-xs"
			color="negative"
		>
			{message}
		</Text>
	);
}
