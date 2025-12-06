'use client';

import { useIsOpen } from '../store';
import { BuyModalContent } from './BuyModalContent';

export const BuyModal = () => {
	const isOpen = useIsOpen();

	if (!isOpen) {
		return null;
	}

	return <BuyModalContent />;
};
