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

type MakeOfferMessageCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: (error: Error | unknown) => void;
};

type CreateListingMessageCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: (error: Error | unknown) => void;
};

type SellCollectibleMessageCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: (error: Error | unknown) => void;
};

type TransferCollectiblesMessageCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: (error: Error | unknown) => void;
};

export type Messages =
	| {
			approveToken?: ApproveTokenMessageCallbacks;
			switchChain?: SwitchChainMessageCallbacks;

			createListing?: CreateListingMessageCallbacks;
			makeOffer?: MakeOfferMessageCallbacks;
			sellCollectible?: SellCollectibleMessageCallbacks;
			transferCollectibles?: TransferCollectiblesMessageCallbacks;
	  }
	| undefined;
