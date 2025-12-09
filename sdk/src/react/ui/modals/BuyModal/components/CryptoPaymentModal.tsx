'use client';

import {
	Button,
	NetworkImage,
	Spinner,
	Text,
	Tooltip,
} from '@0xsequence/design-system';
import type { Hex } from 'viem';
import type { Step } from '../../../../_internal';
import { ErrorLogBox } from '../../../components/_internals/ErrorLogBox';
import { Media } from '../../../components/media/Media';
import { useCryptoPaymentModalContext } from '../internal/cryptoPaymentModalContext';
import { CryptoPaymentModalSkeleton } from './CryptoPaymentModalSkeleton';

export interface CryptoPaymentModalProps {
	chainId: number;
	steps: Step[];
	onSuccess: (hash: Hex | string) => void;
}

export const CryptoPaymentModal = ({
	chainId,
	steps,
	onSuccess,
}: CryptoPaymentModalProps) => {
	const {
		data: { collectible, currency, collection },
		loading: { isLoadingBuyModalData, isLoadingBalance },
		chain: {
			isOnCorrectChain,
			currentChainName,
			requiredChainName,
			currentChainId,
		},
		balance: { hasSufficientBalance },
		transaction: {
			isApproving,
			isExecuting,
			isSwitchingChain,
			isExecutingBundledTransactions,
			isAnyTransactionPending,
		},
		error: { error, dismissError },
		steps: { approvalStep },
		connector: { isSequenceConnector },
		flags: { isMarket },
		permissions: { canApprove, canBuy },
		price: { formattedPrice, renderCurrencyPrice, renderPriceUSD },
		actions: { executeApproval, executeBuy, handleSwitchChain },
	} = useCryptoPaymentModalContext({ chainId, steps, onSuccess });

	const approvalButtonLabel = isApproving ? (
		<div className="flex items-center gap-2">
			<Spinner size="sm" /> Approving Token...
		</div>
	) : (
		'Approve Token'
	);
	const buyButtonLabel =
		isExecuting || isExecutingBundledTransactions ? (
			<div className="flex items-center gap-2">
				<Spinner size="sm" /> Confirming Purchase...
			</div>
		) : (
			'Buy now'
		);

	if (isLoadingBuyModalData || isLoadingBalance) {
		return (
			<CryptoPaymentModalSkeleton
				networkMismatch={!isOnCorrectChain && currentChainId !== undefined}
			/>
		);
	}

	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex items-start gap-4">
					<Media
						assets={[collectible?.image]}
						name={collectible?.name}
						containerClassName="h-[84px] w-[84px] rounded-lg object-cover"
					/>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<Text className="font-bold text-sm text-text-80">
								{collectible?.name}
							</Text>
							<Text className="font-bold text-text-50 text-xs">
								#{collectible?.tokenId}
							</Text>
						</div>
						<Text className="font-bold text-text-50 text-xs">
							{' '}
							{collection?.name}
						</Text>

						<div className="mt-2 flex flex-col">
							<Tooltip
								message={`${formattedPrice} ${currency?.symbol}`}
								side="right"
							>
								<div className="flex items-center gap-1">
									{currency?.imageUrl ? (
										<img
											src={currency.imageUrl}
											alt={currency.symbol}
											className="h-5 w-5 rounded-full"
										/>
									) : (
										<NetworkImage chainId={chainId} size="sm" />
									)}

									<Text className="font-bold text-md">
										{renderCurrencyPrice()}
									</Text>
								</div>
							</Tooltip>

							{isMarket && renderPriceUSD() && (
								<Text className="font-bold text-text-50 text-xs">
									{renderPriceUSD()}
								</Text>
							)}
						</div>
					</div>
				</div>

				{!isLoadingBalance &&
					!isLoadingBuyModalData &&
					!hasSufficientBalance &&
					isOnCorrectChain && (
						<Text className="text-sm text-warning">
							You do not have enough{' '}
							<Text className="font-bold">{currency?.name}</Text> to purchase
							this item
						</Text>
					)}

				{!isOnCorrectChain && currentChainId && (
					<div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
						<Text className="text-amber-300 text-xs">
							Wrong network detected. You&apos;re currently on{' '}
							<Text className="font-bold">{currentChainName}</Text>, but this
							transaction requires{' '}
							<Text className="font-bold">{requiredChainName}</Text>.
						</Text>
					</div>
				)}

				{!isOnCorrectChain && (
					<Button
						onClick={handleSwitchChain}
						disabled={isAnyTransactionPending}
						variant="primary"
						size="lg"
						className="w-full"
					>
						{isSwitchingChain
							? 'Switching Network...'
							: `Switch to ${requiredChainName}`}
					</Button>
				)}

				{approvalStep && !isSequenceConnector && (
					<Button
						onClick={executeApproval}
						disabled={!canApprove || isAnyTransactionPending}
						variant="primary"
						size="lg"
						className="w-full"
					>
						{approvalButtonLabel}
					</Button>
				)}

				{canBuy && (
					<Button
						onClick={() => {
							dismissError();
							return executeBuy();
						}}
						disabled={!canBuy || isAnyTransactionPending}
						variant="primary"
						size="lg"
						className="w-full"
					>
						{buyButtonLabel}
					</Button>
				)}

				{error && (
					<ErrorLogBox
						title={error.title}
						message={error.message}
						error={error.details}
						onDismiss={dismissError}
					/>
				)}
			</div>
		</div>
	);
};
