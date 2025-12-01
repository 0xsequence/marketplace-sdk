import { useAccount } from 'wagmi';
import {
	useCollectible,
	useCollection,
	useCurrency,
} from '../../../../../hooks';
import { useBuyModalContext } from '../../../internal/buyModalContext';
import {
	getSequenceCheckoutOptions,
	isMarketProps,
	isShopProps,
	useBuyModalProps,
} from '../../../store';

export const useCheckoutRouter = () => {
	const props = useBuyModalProps();
	const { chainId, collectionAddress } = props;
	const { checkoutMode } = useBuyModalContext();
	const sequenceCheckoutOptions = getSequenceCheckoutOptions(checkoutMode);

	const isMarket = isMarketProps(props);
	const isShop = isShopProps(props);
	const tokenId = isMarket ? props.tokenId : undefined;

	const { address, isConnecting, isReconnecting } = useAccount();
	const walletIsLoading = isConnecting || isReconnecting;

	const {
		data: collection,
		isLoading: collectionLoading,
		isError: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: collectable,
		isLoading: collectableLoading,
		isError: collectableError,
	} = useCollectible({
		chainId,
		collectionAddress,
		tokenId,
		query: {
			enabled: !!tokenId,
		},
	});

	const { data: currency, isError: currencyError } = useCurrency({
		chainId,
		currencyAddress: isShop ? props.salePrice?.currencyAddress : undefined,
		query: {
			enabled: isShop,
		},
	});

	const shopData = isShop
		? {
				salesContractAddress: props.salesContractAddress,
				items: props.items,
				salePrice: props.salePrice,
				checkoutOptions: sequenceCheckoutOptions,
			}
		: undefined;

	return {
		collection,
		collectable,
		currency,
		// TODO: Fix this
		order: null,
		address,
		shopData,
		isLoading: collectionLoading || collectableLoading || walletIsLoading,
		isError: collectionError || collectableError || currencyError,
	};
};
