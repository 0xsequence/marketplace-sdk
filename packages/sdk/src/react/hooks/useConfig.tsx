'use client';

import { useContext } from 'react';

import { MarketplaceSdkContext } from '../provider';
import { MarketplaceSdkProviderNotFoundError } from '../../utils/_internal/error/context';

export function useConfig() {
	const context = useContext(MarketplaceSdkContext);
	if (!context) {
		throw new MarketplaceSdkProviderNotFoundError();
	}
	return context;
}
