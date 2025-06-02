'use client';

import { BuyModalRouter } from './components/BuyModalRouter';
import { useIsOpen } from './store';

export const BuyModal = () => {
	const isOpen = useIsOpen();

	if (!isOpen) {
		return null;
	}

	return <BuyModalRouter />;
};
