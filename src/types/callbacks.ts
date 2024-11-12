type BaseCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: (error: Error | unknown) => void;
};

export type ApproveTokenCallbacks = BaseCallbacks;

export type SwitchChainCallbacks = BaseCallbacks & {
	onSwitchingNotSupported?: () => void;
	onUserRejectedRequest?: () => void;
};

type CommonCallbacks = {
	approveToken?: ApproveTokenCallbacks;
	switchChain?: SwitchChainCallbacks;
};

type ActionCallbacks<T extends string> =
	| (CommonCallbacks & {
			[K in T]?: BaseCallbacks;
	  })
	| undefined;

export type CreateListingCallbacks = ActionCallbacks<'createListing'>;
export type MakeOfferCallbacks = ActionCallbacks<'makeOffer'>;
export type SellCollectibleCallbacks = ActionCallbacks<'sellCollectible'>;
export type TransferCollectiblesCallbacks = Omit<CommonCallbacks, 'approveToken'> & {
    transferCollectibles?: BaseCallbacks;
};