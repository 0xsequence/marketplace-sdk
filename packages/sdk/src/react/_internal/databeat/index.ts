import type { Auth, Event as DatabeatEvent } from '@databeat/tracker';
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
	trackSellItems(args: TrackSellItems): void {
		this.track({
			event: 'SELL_ITEMS',
			props: args.props,
			nums: args.nums,
		});
	}

	trackCreateListing(args: TrackCreateListing): void {
		this.track({
			event: 'CREATE_LISTING',
			props: args.props,
			nums: args.nums,
		});
	}

	trackCreateOffer(args: TrackCreateOffer): void {
		this.track({
			event: 'CREATE_OFFER',
			props: args.props,
			nums: args.nums,
		});
	}

	trackTransactionFailed(args: TrackTransactionFailed): void {
		this.track({
			event: 'TRANSACTION_FAILED',
			props: args,
		});
	}
}

export const useAnalytics = (): DatabeatAnalytics => {
	const config = useConfig();
	const server = 'https://nodes.sequence.app';

	const auth: Auth = {};
	auth.headers = { 'X-Access-Key': config.projectAccessKey };

	return new DatabeatAnalytics(server, auth, {
		defaultEnabled: true,
		initProps: () => {
			return { origin: window.location.origin };
		},
	});
};
