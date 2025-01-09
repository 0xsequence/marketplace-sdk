import type { ModalCallbacks } from '../_internal/types';
import { sellModal$, OpenSellModalArgs } from './_store';

type ShowSellModalArgs = Exclude<OpenSellModalArgs, 'callbacks'>;

export const useSellModal = (callbacks?: ModalCallbacks) => {
  return {
    show: (args: ShowSellModalArgs) =>
      sellModal$.open({ ...args, callbacks }),
    close: () => sellModal$.close(),
  };
};

export { SellModal } from './Modal';
export type { OpenSellModalArgs, ShowSellModalArgs };
    const state = sellModal$.get();
    const { tokenId, collectionAddress, chainId, order, callbacks } = state;
		const { data: collectible } = useCollection({
			chainId,
			collectionAddress,
		});
		const [approvalExecutedSuccess, setApprovalExecutedSuccess] =
			useState(false);
		const {
			data: collection,
			isLoading: collectionLoading,
			isError: collectionError,
		} = useCollection({
			chainId,
			collectionAddress,
		});
		const currencyOptions = useCurrencyOptions({ collectionAddress });
		const { data: currencies, isLoading: currenciesLoading } = useCurrencies({
			chainId,
			currencyOptions,
		});
		const { getSellSteps, isLoading: machineLoading } = useSell({
			collectionAddress,
			chainId,
			enabled: sellModal$.isOpen.get(),
			onApprovalSuccess: () => setApprovalExecutedSuccess(true),
			onTransactionSent: (hash) => {
				if (!hash) return;
				showTransactionStatusModal({
					hash: hash,
					price: order
						? {
								amountRaw: order.priceAmount,
								currency: currencies?.find(
									(currency) =>
										currency.contractAddress === order.priceCurrencyAddress,
								) ?? {
									chainId: Number(chainId),
									contractAddress: order.priceCurrencyAddress,
									name: 'Unknown',
									symbol: 'UNK',
									decimals: 18,
									imageUrl: '',
									exchangeRate: 0,
									defaultChainCurrency: false,
									nativeCurrency: false,
									createdAt: new Date().toISOString(),
									updatedAt: new Date().toISOString(),
								},
							}
						: undefined,
					collectionAddress,
					chainId,
					collectibleId: tokenId,
					type: TransactionType.SELL,
					queriesToInvalidate: [
						...collectableKeys.all,
						balanceQueries.all,
					] as unknown as QueryKey[],
					callbacks,
				});
				sellModal$.close();
			},
		});

		const { isLoading, steps, refreshSteps } = getSellSteps({
			orderId: order?.orderId ?? '',
			marketplace: order?.marketplace as MarketplaceKind,
			quantity: order?.quantityRemaining
				? parseUnits(
						order.quantityRemaining,
						collectible?.decimals || 0,
					).toString()
				: '1',
		});

		useEffect(() => {
			refreshSteps();
		}, [order, machineLoading]);

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const handleStepExecution = async (execute?: any) => {
			if (!execute) return;
			try {
				await refreshSteps();
				await execute();
			} catch (error) {
				if (callbacks?.onError) {
					callbacks.onError(error as Error);
				} else {
					console.debug('onError callback not provided:', error);
				}
			}
		};

		const isLoading = collectionLoading || currenciesLoading || machineLoading;
		const isError = collectionError || !order;

		if (isLoading) {
			return (
				<LoadingModal
					isOpen={sellModal$.isOpen.get()}
					chainId={Number(chainId)}
					onClose={sellModal$.close}
					title="You have an offer"
				/>
			);
		}

		if (collectionError || order === undefined) {
			return (
				<ErrorModal
					isOpen={sellModal$.isOpen.get()}
					chainId={Number(chainId)}
					onClose={sellModal$.close}
					title="You have an offer"
				/>
			);
		}

		const approvalNeeded = steps?.approval.isPending;

		const currency = currencies?.find(
			(c) => c.contractAddress === order?.priceCurrencyAddress,
		);

		const ctas = [
			{
				label: 'Approve TOKEN',
				onClick: () => handleStepExecution(() => steps?.approval.execute()),
				hidden: !approvalNeeded || approvalExecutedSuccess,
				pending: steps?.approval.isExecuting || isLoading,
				variant: 'glass' as const,
				disabled: isLoading || steps?.transaction.isExecuting,
			},
			{
				label: 'Accept',
				onClick: () => handleStepExecution(() => steps?.transaction.execute()),
				pending: steps?.transaction.isExecuting || isLoading,
				disabled: (!approvalExecutedSuccess && approvalNeeded) || isLoading,
			},
		] satisfies ActionModalProps['ctas'];

		return (
			<ActionModal
				isOpen={sellModal$.isOpen.get()}
				chainId={Number(chainId)}
				onClose={sellModal$.close}
				title="You have an offer"
				ctas={ctas}
			>
				<TransactionHeader
					title="Offer received"
					currencyImageUrl={currency?.imageUrl}
					date={order && new Date(order.createdAt)}
				/>
				<TokenPreview
					collectionName={collection?.name}
					collectionAddress={collectionAddress}
					collectibleId={tokenId}
					chainId={chainId}
				/>
				<TransactionDetails
					collectibleId={tokenId}
					collectionAddress={collectionAddress}
					chainId={chainId}
					price={
						currency
							? {
									amountRaw: order?.priceAmount,
									currency,
								}
							: undefined
					}
					currencyImageUrl={currency?.imageUrl}
				/>
			</ActionModal>
		);
	},
);
