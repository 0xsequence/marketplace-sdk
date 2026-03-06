import type { Address } from '@0xsequence/api-client';
import {
	SEQUENCE_MARKET_V1_ADDRESS,
	SEQUENCE_MARKET_V2_ADDRESS,
} from '../consts';
import { OrderbookKind } from '../types';
import { normalizeOrderbookKind } from './normalizeMarketplace';

/**
 * OpenSea Conduit address
 * https://etherscan.io/address/0x1e0049783f008a0085193e00003d00cd54003c71
 */
export const OPENSEA_SEAPORT_CONDUIT_ADDRESS =
	'0x1E0049783F008A0085193E00003D00cd54003c71' as Address;

export function getConduitAddressForOrderbook(
	orderbookKind: OrderbookKind | undefined,
): Address | undefined {
	switch (normalizeOrderbookKind(orderbookKind)) {
		case OrderbookKind.sequence_marketplace_v1:
			return SEQUENCE_MARKET_V1_ADDRESS as Address;
		case OrderbookKind.sequence_marketplace_v2:
			return SEQUENCE_MARKET_V2_ADDRESS as Address;
		case OrderbookKind.opensea:
			return OPENSEA_SEAPORT_CONDUIT_ADDRESS;
		default:
			// Default to v2 for unknown orderbooks
			return SEQUENCE_MARKET_V2_ADDRESS as Address;
	}
}
