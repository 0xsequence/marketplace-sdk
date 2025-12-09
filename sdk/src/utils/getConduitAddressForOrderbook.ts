import type { Address } from 'viem';
import {
	SEQUENCE_MARKET_V1_ADDRESS,
	SEQUENCE_MARKET_V2_ADDRESS,
} from '../consts';
import { OrderbookKind } from '../types';

/**
 * OpenSea Conduit address
 * https://etherscan.io/address/0x1e0049783f008a0085193e00003d00cd54003c71
 */
export const OPENSEA_SEAPORT_CONDUIT_ADDRESS =
	'0x1E0049783F008A0085193E00003D00cd54003c71' as Address;

/**
 * Magic Eden Conduit address
 * https://etherscan.io/address/0x2052f8A2Ff46283B30084e5d84c89A2fdBE7f74b
 */
export const MAGICEDEN_CONDUIT_ADDRESS =
	'0x2052f8A2Ff46283B30084e5d84c89A2fdBE7f74b' as Address;

export function getConduitAddressForOrderbook(
	orderbookKind: OrderbookKind | undefined,
): Address | undefined {
	switch (orderbookKind) {
		case OrderbookKind.sequence_marketplace_v1:
			return SEQUENCE_MARKET_V1_ADDRESS as Address;
		case OrderbookKind.sequence_marketplace_v2:
			return SEQUENCE_MARKET_V2_ADDRESS as Address;
		case OrderbookKind.opensea:
			return OPENSEA_SEAPORT_CONDUIT_ADDRESS;
		case OrderbookKind.magic_eden:
			return MAGICEDEN_CONDUIT_ADDRESS;
		default:
			// Default to v2 for unknown orderbooks
			return SEQUENCE_MARKET_V2_ADDRESS as Address;
	}
}
