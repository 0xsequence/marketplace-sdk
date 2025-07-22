'use client';

import { Text } from '@0xsequence/design-system';
import { useSelector } from '@xstate/store/react';
import { sellModalStore } from '../store/sellModalStore';

export const SellModalSuccess = () => {
	const order = useSelector(sellModalStore, (state) => state.context.order);

	return (
		<div className="flex h-[200px] flex-col items-center justify-center gap-4">
			<div className="text-green-500">
				<svg
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path d="M20 6L9 17l-5-5" />
				</svg>
			</div>
			<Text className="text-center font-body">
				Successfully accepted offer for {order?.priceAmountFormatted}
			</Text>
		</div>
	);
};
