type ApproveTokenMessageCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: () => void;
};

export type SwitchChainMessageCallbacks = {
	onSuccess?: () => void;
	onSwitchingNotSupported?: () => void;
	onUserRejectedRequest?: () => void;
	onUnknownError?: () => void;
};

type SellCollectibleMessageCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: () => void;
};

export type Messages =
	| {
			approveToken?: ApproveTokenMessageCallbacks;
			sellCollectible?: SellCollectibleMessageCallbacks;
			switchChain?: SwitchChainMessageCallbacks;
	  }
	| undefined;
