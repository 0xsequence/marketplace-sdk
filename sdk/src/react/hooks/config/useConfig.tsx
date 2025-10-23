'use client';

import { useContext } from 'react';

import { MarketplaceProviderNotFoundError } from '../../../utils/errors';
import { MarketplaceSdkContext } from '../../providers';

export function useConfig() {
	const context = useContext(MarketplaceSdkContext);
	if (!context) {
		throw new MarketplaceProviderNotFoundError();
	}
	return context;
}
