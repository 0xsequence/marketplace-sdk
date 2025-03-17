'use client';

import { useContext } from 'react';

import type { SdkConfig } from '../../types';
import { MarketplaceSdkProviderNotFoundError } from '../../utils/_internal/error/context';
import { MarketplaceSdkContext } from '../provider';

export function useConfig(): SdkConfig {
	const context = useContext(MarketplaceSdkContext);
	if (!context) {
		throw new MarketplaceSdkProviderNotFoundError();
	}
	return context;
}
