import type { Hex } from 'viem';
import { buyModal$ } from './_store';
import { TransactionSwapProvider, type Order } from '../../../_internal';
import { Show } from '@legendapp/state/react';
import {
	useCheckoutOptions,
	useCollection,
	useGenerateBuyTransaction,
} from '../../../hooks';
import { useAccount } from 'wagmi';
import { StepType } from '../../../../types';
import { useSelectPaymentModal } from '@0xsequence/kit-checkout';

export type ShowBuyModalArgs = {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	order: Order;
};

export const useBuyModal = () => {
	const handleShowModal = (args: ShowBuyModalArgs) => {
		buyModal$.state.set({
			...buyModal$.state.get(),
			collectionAddress: args.collectionAddress,
			chainId: args.chainId,
			tokenId: args.tokenId,
			order: args.order,
		});
		buyModal$.isOpen.set(true);
	};

	return {
		show: handleShowModal,
		close: () => buyModal$.close(),
	};
};

export const BuyModal = () => {
	return (
		<Show if={buyModal$.isOpen}>
			<Modal />
		</Show>
	);
};
const Modal = () => {
	const { data: collection, isSuccess: isSuccessCollection } = useCollection({
		chainId: buyModal$.state.chainId.get(),
		collectionAddress: buyModal$.state.collectionAddress.get(),
	});
	if (!isSuccessCollection) return <></>;

	const collectionType = collection?.type;
	if (collectionType === 'ERC721') return <CheckoutModal />;
	return <CheckoutModal />;
};

// const Modal1155 = observer(() => {
//   const { collectionAddress, chainId, tokenId, order } = buyModal$.state.get();

//   const { data: currencies } = useCurrencies({ chainId, collectionAddress });
//   const currency = currencies?.find(
//     (currency) => currency.contractAddress === order?.priceCurrencyAddress
//   );

//   const ctas = [
//     {
//       label: "Accept",
//       onClick: () => {},
//     },
//   ] satisfies ActionModalProps["ctas"];

//   return (
//     <ActionModal
//       store={buyModal$}
//       onClose={() => buyModal$.close()}
//       title="You have an offer"
//       ctas={ctas}
//     >
//       <TransactionDetails
//         collectibleId={tokenId}
//         collectionAddress={collectionAddress}
//         chainId={chainId}
//         price={
//           currency
//             ? ({ amountRaw: order?.priceAmount, currency } as Price)
//             : undefined
//         }
//       />
//     </ActionModal>
//   );
// });

const CheckoutModal = () => {
	const { address } = useAccount();
	const { openSelectPaymentModal } = useSelectPaymentModal();

	const { collectionAddress, chainId, quantity } = buyModal$.state.get();

	const order = {
		collectionAddress,
		quantity,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		orderId: buyModal$.state.order.orderId.get()!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		marketplace: buyModal$.state.order.marketplace.get()!,
	} as const;

	const {
		data: checkoutOptions,
		isLoading: isLoadingCheckout,
		error: checkoutError,
	} = useCheckoutOptions({
		chainId: buyModal$.state.chainId.get(),
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		walletAddress: address!,
		orders: [order],
	});

	const {
		generateBuyTransaction,
		data: steps,
		error: generateBuyTransactionError,
	} = useGenerateBuyTransaction({
		chainId: buyModal$.state.chainId.get(),
	});

	const {
		data: collection,
		isLoading: isLoadingCollection,
		error: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	if (isLoadingCollection) {
		console.log('Loading collection data...');
		return <></>;
	}

	if (collectionError) {
		console.error('Collection data error:', collectionError);
		return <></>;
	}

	if (isLoadingCheckout) {
		console.log('Loading checkout options...');
		return <></>;
	}

	if (checkoutError) {
		console.error('Checkout options error:', checkoutError);
		return <></>;
	}

	generateBuyTransaction({
		collectionAddress: buyModal$.state.collectionAddress.get(),
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		buyer: address!,
		ordersData: [
			{
				...order,
				quantity: String(order.quantity),
			},
		],
		marketplace: order.marketplace,
		additionalFees: [],
	});

	if (generateBuyTransactionError) {
		console.error(
			'Generate buy transaction error:',
			generateBuyTransactionError,
		);
		return <></>;
	}

	if (!steps) {
		console.log('No steps generated');
		return <></>;
	}

	const buyStep = steps.find((step) => step.id === StepType.buy);

	openSelectPaymentModal({
		chain: buyModal$.state.chainId.get(),
		collectibles: [
			{
				tokenId: buyModal$.state.tokenId.get(),
				quantity: String(buyModal$.state.quantity.get()),
				decimals: collection?.decimals,
			},
		],
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		currencyAddress: buyModal$.state.order.priceCurrencyAddress.get()!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		price: buyModal$.state.order.priceAmount.get()!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		targetContractAddress: buyStep?.to!,
		txData: buyStep?.data as Hex,
		collectionAddress,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		recipientAddress: address!,
		onSuccess: (txHash: string) => {},
		onError: (error: Error) => {},
		enableMainCurrencyPayment: true,
		enableSwapPayments:
			checkoutOptions?.options.swap?.includes(TransactionSwapProvider.zerox) ||
			false,
		creditCardProviders: checkoutOptions?.options.nftCheckout,
	});

	return <></>;
};
