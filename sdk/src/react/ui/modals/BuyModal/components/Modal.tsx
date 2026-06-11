'use client';

import {
	type WagmiAdapterOptions,
	wagmiAdapter,
} from '@0xtrails/adapter-wagmi';
import { TrailsProvider } from '0xtrails/widget';
import { useConfig as useWagmiConfig } from 'wagmi';
import {
	getSequenceApiUrl,
	getSequenceIndexerUrl,
	getSequenceNodeGatewayUrl,
	getTrailsApiUrl,
} from '../../../../_internal/api/services';
import { useConfig } from '../../../../hooks';
import { useWaasFeeOptions } from '../../../../hooks/utils/useWaasFeeOptions';
import { useIsOpen } from '../store';
import { BuyModalContent } from './BuyModalContent';

type TrailsUseWaasFeeOptions = NonNullable<
	NonNullable<WagmiAdapterOptions['sequence']>['useWaasFeeOptions']
>;

export const BuyModal = () => {
	const isOpen = useIsOpen();

	if (!isOpen) {
		return null;
	}

	return <BuyModalWithTrailsProvider />;
};

const useTrailsWaasFeeOptions: TrailsUseWaasFeeOptions = ({
	chainIdOverride,
} = {}) => {
	const config = useConfig();
	const {
		pendingFeeOptionConfirmation,
		confirmPendingFeeOption,
		rejectPendingFeeOption,
	} = useWaasFeeOptions(chainIdOverride ?? 0, config);

	return [
		pendingFeeOptionConfirmation,
		confirmPendingFeeOption,
		rejectPendingFeeOption,
	];
};

const BuyModalWithTrailsProvider = () => {
	const config = useConfig();
	const wagmiConfig = useWagmiConfig();

	return (
		<TrailsProvider
			config={{
				trailsApiKey: config.projectAccessKey,
				trailsApiUrl: getTrailsApiUrl(config),
				sequenceIndexerUrl: getSequenceIndexerUrl(config),
				sequenceNodeGatewayUrl: getSequenceNodeGatewayUrl(config),
				sequenceApiUrl: getSequenceApiUrl(config),
				walletConnectProjectId: config.walletConnectProjectId,
				adapters: [
					wagmiAdapter({
						wagmiConfig,
						sequence: { useWaasFeeOptions: useTrailsWaasFeeOptions },
					}),
				],
			}}
		>
			<BuyModalContent />
		</TrailsProvider>
	);
};
