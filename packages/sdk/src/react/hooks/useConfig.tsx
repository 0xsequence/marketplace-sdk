'use client';

import { useContext } from 'react';

import { MarketplaceSdkProviderNotFoundError } from '../../utils/_internal/error/context';
import { MarketplaceSdkContext } from '../provider';
import { SdkConfig } from '../../types';

export function useConfig(): SdkConfig {
	const context = useContext(MarketplaceSdkContext);
	if (!context) {
		throw new MarketplaceSdkProviderNotFoundError();
	}
	return context;
}
