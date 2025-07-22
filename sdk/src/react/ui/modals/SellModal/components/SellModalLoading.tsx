'use client';

import { Spinner } from '@0xsequence/design-system';

interface SellModalLoadingProps {
	message: string;
}

export const SellModalLoading = ({ message }: SellModalLoadingProps) => {
	return (
		<div className="flex h-[200px] flex-col items-center justify-center gap-4">
			<Spinner />
			<p className="text-gray-600">{message}</p>
		</div>
	);
};
