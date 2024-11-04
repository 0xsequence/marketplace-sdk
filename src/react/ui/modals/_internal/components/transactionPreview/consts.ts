export const TRANSACTION_TITLES = {
	sell: {
		confirming: 'Selling',
		confirmed: 'Sold',
		failed: 'Sale failed',
	},
	createListing: {
		confirming: 'Creating listing',
		confirmed: 'Listed',
		failed: 'Listing failed',
	},
	createOffer: {
		confirming: 'Creating offer',
		confirmed: 'Offer created',
		failed: 'Offer failed',
	},
	buy: {
		confirming: 'Buying',
		confirmed: 'Bought',
		failed: 'Purchase failed',
	},
} as const;
