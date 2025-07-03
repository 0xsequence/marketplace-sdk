import {
	LookupMarketplaceReturn,
	MarketplaceConfig,
	SdkConfig,
} from './new-marketplace-types-Cggo50UM.js';
import * as _tanstack_react_query415 from '@tanstack/react-query';

//#region src/react/queries/marketplaceConfig.d.ts
declare const fetchMarketplaceConfig: ({
	config,
	prefetchedMarketplaceSettings,
}: {
	config: SdkConfig;
	prefetchedMarketplaceSettings?: LookupMarketplaceReturn;
}) => Promise<MarketplaceConfig>;
declare const marketplaceConfigOptions: (
	config: SdkConfig,
) => _tanstack_react_query415.OmitKeyof<
	_tanstack_react_query415.UseQueryOptions<
		MarketplaceConfig,
		Error,
		MarketplaceConfig,
		('configs' | 'marketplace')[]
	>,
	'queryFn'
> & {
	queryFn?:
		| _tanstack_react_query415.QueryFunction<
				MarketplaceConfig,
				('configs' | 'marketplace')[],
				never
		  >
		| undefined;
} & {
	queryKey: ('configs' | 'marketplace')[] & {
		[dataTagSymbol]: MarketplaceConfig;
		[dataTagErrorSymbol]: Error;
	};
};
//#endregion
export { fetchMarketplaceConfig, marketplaceConfigOptions };
//# sourceMappingURL=index-CRGrJ7is.d.ts.map
