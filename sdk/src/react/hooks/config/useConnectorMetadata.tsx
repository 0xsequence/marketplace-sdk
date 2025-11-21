import { WalletKind } from '@0xsequence/api-client';
import { useAccount } from 'wagmi';

export const useConnectorMetadata = () => {
	const { connector } = useAccount();

	const isWaaS = connector?.id.endsWith('waas') ?? false;
	const isSequence = connector?.id.includes('sequence');
	const walletKind = isSequence ? WalletKind.sequence : WalletKind.unknown;

	return {
		isWaaS,
		isSequence,
		walletKind,
	};
};
