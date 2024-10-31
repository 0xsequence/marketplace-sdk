import type { ChainId as NetworkChainId } from '@0xsequence/network';

export type QueryArg = {
	query?: {
		enabled?: boolean;
		//TODO: Add more fields
	};
};

export type ChainId = string | number | NetworkChainId;

export type ApproveTokenMessageCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: () => void;
};

export type SwitchNetworkMessageCallbacks = {
	onSuccess: () => void;
	onSwitchingNotSupported: () => void;
	onUserRejectedRequest: () => void;
	onUnknownError: () => void;
};

export type SellCollectibleMessageCallbacks = {
	onSuccess: () => void;
	onUnknownError: () => void;
};
