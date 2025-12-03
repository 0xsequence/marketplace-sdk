export const TRANSACTION_TITLES = {
	SELL: {
		confirming: 'Selling',
		confirmed: 'Sold',
		failed: 'Sale failed',
	},
	LISTING: {
		confirming: 'Creating listing',
		confirmed: 'Listed',
		failed: 'Listing failed',
	},
	OFFER: {
		confirming: 'Creating offer',
		confirmed: 'Offer created',
		failed: 'Offer failed',
	},
	BUY: {
		confirming: 'Buying',
		confirmed: 'Bought',
		failed: 'Purchase failed',
	},
	TRANSFER: {
		confirming: 'Transferring',
		confirmed: 'Transferred',
		failed: 'Transfer failed',
	},
	CANCEL: {
		confirming: 'Cancelling',
		confirmed: 'Cancelled',
		failed: 'Cancellation failed',
	},
} as const;
