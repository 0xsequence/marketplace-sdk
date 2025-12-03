'use client';

import { useIsOpen } from '../store';
import { BuyModalRouter } from './BuyModalRouter';

export const BuyModal = () => {
	const isOpen = useIsOpen();

	if (!isOpen) {
		return null;
	}

	return <BuyModalRouter />;
};
