type ApproveTokenMessageCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: (error: Error | unknown) => void;
};

export type SwitchChainMessageCallbacks = {
	onSuccess?: () => void;
	onSwitchingNotSupported?: () => void;
	onUserRejectedRequest?: () => void;
	onUnknownError?: (error: Error | unknown) => void;
};

type SellCollectibleMessageCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: (error: Error | unknown) => void;
};

export type Messages =
	| {
			approveToken?: ApproveTokenMessageCallbacks;
			sellCollectible?: SellCollectibleMessageCallbacks;
			switchChain?: SwitchChainMessageCallbacks;
	  }
	| undefined;
