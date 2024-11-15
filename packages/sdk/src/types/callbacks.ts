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

export type CreateListingErrorCallbacks = BaseErrorCallbacks & {
	onCreateListingError?: (error: Error | unknown) => void;
  };
export type CreateListingSuccessCallbacks = BaseSuccessCallbacks & {
	onCreateListingSuccess?: () => void;
};

export type MakeOfferErrorCallbacks = BaseErrorCallbacks & {
	onMakeOfferError?: (error: Error | unknown) => void;
};
export type MakeOfferSuccessCallbacks = BaseSuccessCallbacks & {
	onMakeOfferSuccess?: () => void;
};

export type SellErrorCallbacks = BaseErrorCallbacks & {
	onSellError?: (error: Error | unknown) => void;
};
export type SellSuccessCallbacks = BaseSuccessCallbacks & {
	onSellSuccess?: () => void;
};

export type TransferErrorCallbacks = BaseErrorCallbacks & {
	onTransferError?: (error: Error | unknown) => void;
};
export type TransferSuccessCallbacks = BaseSuccessCallbacks & {
	onTransferSuccess?: () => void;
};
