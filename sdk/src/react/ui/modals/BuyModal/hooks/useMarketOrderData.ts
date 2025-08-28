import { skipToken } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { useCollectible, useCurrency } from '../../../../hooks';
import { isMarketProps, useBuyModalProps } from '../store';
import { useCheckoutOptions } from './useCheckoutOptions';

type UseMarketOrderDataProps = {
	enabled: boolean;
};

export const useMarketOrderData = (props: UseMarketOrderDataProps) => {
	const buyModalProps = useBuyModalProps();
	const { chainId, collectionAddress } = buyModalProps;

	const isMarket = isMarketProps(buyModalProps);
	const collectibleId = isMarket ? buyModalProps.collectibleId : undefined;

	const { address, isConnecting, isReconnecting } = useAccount();
	const walletIsLoading = isConnecting || isReconnecting;

	const {
		data: collectible,
		isLoading: collectableLoading,
		isError: collectableError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
		query: {
			enabled: !!collectibleId && props.enabled,
		},
	});

	const {
		data: marketplaceCheckoutOptions,
		isLoading: marketplaceCheckoutOptionsLoading,
		isError: marketplaceCheckoutOptionsError,
	} = useCheckoutOptions(
		isMarket
			? {
					chainId,
					collectionAddress,
					orderId: buyModalProps.orderId,
					marketplace: buyModalProps.marketplace,
					query: {
						enabled: props.enabled,
					},
				}
			: skipToken,
	);

	const {
		data: currency,
		isLoading: currencyLoading,
		isError: currencyError,
	} = useCurrency({
		chainId,
		currencyAddress: marketplaceCheckoutOptions?.order
			?.priceCurrencyAddress as Address,
		query: {
			enabled: props.enabled,
		},
	});

	return {
		collectible,
		currency,
		order: marketplaceCheckoutOptions?.order,
		checkoutOptions: marketplaceCheckoutOptions,
		address,
		isLoading:
			collectableLoading ||
			(isMarket && marketplaceCheckoutOptionsLoading) ||
			walletIsLoading ||
			currencyLoading,
		isError:
			collectableError || marketplaceCheckoutOptionsError || currencyError,
	};
};
