'use client';

import { useContext } from 'react';

import { MarketplaceSdkProviderNotFoundError } from '../../../utils/_internal/error/context';
import { MarketplaceSdkContext } from '../../providers';

export function useConfig() {
	const context = useContext(MarketplaceSdkContext);
	if (!context) {
		throw new MarketplaceSdkProviderNotFoundError();
	}
	return context;
}
