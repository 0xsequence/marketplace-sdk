import { useQuery } from '@tanstack/react-query';
import { type UseHighestOfferArgs, highestOfferOptions } from '../queries';
import { useConfig } from './useConfig';

export function useHighestOffer(args: UseHighestOfferArgs) {
	const config = useConfig();
	return useQuery(highestOfferOptions(args, config));
}
