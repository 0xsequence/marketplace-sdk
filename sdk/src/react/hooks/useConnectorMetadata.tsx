import { useAccount } from 'wagmi';
import { WalletKind } from '../_internal/api';

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
