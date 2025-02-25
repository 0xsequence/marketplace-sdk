import type { Event as DatabeatEvent } from '@databeat/tracker';
import { Databeat } from '@databeat/tracker';

import { useConfig } from '../../hooks';
import type {
	EventType,
	TrackCreateListing,
	TrackCreateOffer,
	TrackSellItems,
	TrackTransactionFailed,
} from './types';

export type EventTypes = keyof typeof EventType;
export type Event = DatabeatEvent<EventTypes>;

export class DatabeatAnalytics extends Databeat<Extract<EventTypes, string>> {
	// Currently handled by kit-checkout
	// trackBuyItems(args: TrackBuyItems) {
	//   this.track({
	//     event: 'BUY_ITEMS',
	//     props: args.props,
	//     nums: args.nums
	//   })
	// }

	trackSellItems(args: TrackSellItems) {
		this.track({
			event: 'SELL_ITEMS',
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
	const config = useConfig();
	return new DatabeatAnalytics('https://databeat.sequence.app', {
		jwt: config.projectAccessKey,
	});
};
