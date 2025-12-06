import type { Event as DatabeatEvent } from '@databeat/tracker';
import { Databeat } from '@databeat/tracker';
import { useContext } from 'react';

import { MarketplaceSdkContext } from '../../providers';
import type {
	EventType,
	TrackBuyModalOpened,
	TrackCreateListing,
	TrackCreateOffer,
	TrackSellItems,
	TrackTransactionFailed,
} from './types';

export type EventTypes = keyof typeof EventType;
export type Event = DatabeatEvent<EventTypes>;

export class DatabeatAnalytics extends Databeat<Extract<EventTypes, string>> {
	trackSellItems(args: TrackSellItems) {
		this.track({
			event: 'SELL_ITEMS',
			props: args.props,
			nums: args.nums,
		});
	}

	trackBuyModalOpened(args: TrackBuyModalOpened) {
		this.track({
			event: 'BUY_MODAL_OPENED',
			props: args.props,
			nums: args.nums,
		});
	}

	trackCreateListing(args: TrackCreateListing) {
		this.track({
			event: 'CREATE_LISTING',
			props: args.props,
			nums: args.nums,
		});
	}

	trackCreateOffer(args: TrackCreateOffer) {
		this.track({
			event: 'CREATE_OFFER',
			props: args.props,
			nums: args.nums,
		});
	}

	trackTransactionFailed(args: TrackTransactionFailed) {
		this.track({
			event: 'TRANSACTION_FAILED',
			props: args,
		});
	}
}

export const useAnalytics = () => {
	const context = useContext(MarketplaceSdkContext);

	if (!context) {
		throw new Error('useAnalytics must be used within MarketplaceProvider');
	}

	return context.analytics;
};
