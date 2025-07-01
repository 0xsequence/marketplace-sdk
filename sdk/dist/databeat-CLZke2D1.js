import { useConfig } from "./hooks-BrYPaFP7.js";
import { Databeat } from "@databeat/tracker";

//#region src/react/_internal/databeat/index.ts
var DatabeatAnalytics = class extends Databeat {
	trackSellItems(args) {
		this.track({
			event: "SELL_ITEMS",
			props: args.props,
			nums: args.nums
		});
	}
	trackCreateListing(args) {
		this.track({
			event: "CREATE_LISTING",
			props: args.props,
			nums: args.nums
		});
	}
	trackCreateOffer(args) {
		this.track({
			event: "CREATE_OFFER",
			props: args.props,
			nums: args.nums
		});
	}
	trackTransactionFailed(args) {
		this.track({
			event: "TRANSACTION_FAILED",
			props: args
		});
	}
};
const useAnalytics = () => {
	const config = useConfig();
	const server = "https://nodes.sequence.app";
	const auth = {};
	auth.headers = { "X-Access-Key": config.projectAccessKey };
	return new DatabeatAnalytics(server, auth, {
		defaultEnabled: true,
		initProps: () => {
			return { origin: window.location.origin };
		}
	});
};

//#endregion
export { DatabeatAnalytics, useAnalytics };
//# sourceMappingURL=databeat-CLZke2D1.js.map