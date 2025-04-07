import { useQuery } from '@tanstack/react-query';
import { type UseLowestListingArgs, lowestListingOptions } from '../queries';
import { useConfig } from './useConfig';

export function useLowestListing(args: UseLowestListingArgs) {
	const config = useConfig();
	return useQuery(lowestListingOptions(args, config));
}
