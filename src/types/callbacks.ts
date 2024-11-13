export type BaseCallbacks = {
	onSuccess?: () => void;
	onUnknownError?: (error: Error | unknown) => void;
};

export type SwitchChainCallbacks = BaseCallbacks & {
	onSwitchingNotSupported?: () => void;
	onUserRejectedRequest?: () => void;
};

export type OnApproveTokenError = (error: Error | unknown) => void;

export type BaseErrorCallbacks = {
	onApproveTokenError?: OnApproveTokenError;
	onSwitchingNotSupportedError?: () => void;
	onUserRejectedSwitchingChainRequestError?: () => void;
	onSwitchChainError?: (error: Error | unknown) => void;
};

export type BaseSuccessCallbacks = {
	onApproveTokenSuccess?: () => void;
	onSwitchChainSuccess?: () => void;
};

type ActionCallbacks<T extends string> = {
	[K in `on${T}${['Error', 'Success'][number]}`]?: K extends `on${T}Error`
		? (error: Error | unknown) => void
		: () => void;
};

export type CreateListingErrorCallbacks = BaseErrorCallbacks &
	ActionCallbacks<'CreateListing'>;
export type CreateListingSuccessCallbacks = BaseSuccessCallbacks &
	ActionCallbacks<'CreateListing'>;

export type TransferErrorCallbacks = BaseErrorCallbacks &
	ActionCallbacks<'Transfer'>;
export type TransferSuccessCallbacks = BaseSuccessCallbacks &
	ActionCallbacks<'Transfer'>;

export type MakeOfferErrorCallbacks = BaseErrorCallbacks &
	ActionCallbacks<'MakeOffer'>;
export type MakeOfferSuccessCallbacks = BaseSuccessCallbacks &
	ActionCallbacks<'MakeOffer'>;

export type SellErrorCallbacks = BaseErrorCallbacks & ActionCallbacks<'Sell'>;
export type SellSuccessCallbacks = BaseSuccessCallbacks &
	ActionCallbacks<'Sell'>;
