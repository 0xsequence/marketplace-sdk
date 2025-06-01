'use client';

import { BuyModalRouter } from './components/BuyModalRouter';
import { useIsOpen } from './store';

/**
 * Main BuyModal component - now simplified to just handle open/close state
 * All complex logic has been moved to specialized components via BuyModalRouter
 */
export const BuyModal = () => {
	const isOpen = useIsOpen();

	if (!isOpen) {
		return null;
	}

	return <BuyModalContent />;
};

/**
 * Modal content wrapper - routes to appropriate specialized modal
 */
const BuyModalContent = () => {
	return <BuyModalRouter />;
};
