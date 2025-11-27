'use client';

import { Text } from '@0xsequence/design-system';
import { useBuyModalContext } from '../internal/buyModalContext';
import { getSequenceCheckoutOptions } from '../store';

export const SequenceCheckout = () => {
	const { checkoutMode } = useBuyModalContext();
	const _options = getSequenceCheckoutOptions(checkoutMode);

	// TODO: Implement SequenceCheckout component with options
	return (
		<div className="flex w-full items-center justify-center py-8">
			<div className="flex flex-col items-center gap-4">
				<Text className="text-text-80">Sequence Checkout Coming Soon</Text>
			</div>
		</div>
	);
};
