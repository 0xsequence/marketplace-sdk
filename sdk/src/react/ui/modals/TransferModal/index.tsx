'use client';

import { useState } from 'react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../../types/waas-types';
import { compareAddress } from '../../../../utils';
import { InvalidContractTypeError } from '../../../../utils/errors';
import { ContractType } from '../../../_internal';
import {
	useCollectible,
	useConnectorMetadata,
	useEnsureCorrectChain,
	useListBalances,
	useModalData,
} from '../../../hooks';
import {
	ActionModal,
	type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import AlertMessage from '../_internal/components/alertMessage';
import SelectWaasFeeOptions from '../_internal/components/selectWaasFeeOptions';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../_internal/components/selectWaasFeeOptions/store';
import TokenPreview from '../_internal/components/tokenPreview';
import { useSelectWaasFeeOptions } from '../_internal/hooks/useSelectWaasFeeOptions';
import type { ModalCallbacks } from '../_internal/types';
import TokenQuantityInput from './_views/enterWalletAddress/_components/TokenQuantityInput';
import WalletAddressInput from './_views/enterWalletAddress/_components/WalletAddressInput';
import useHandleTransfer from './_views/enterWalletAddress/useHandleTransfer';
import getMessage from './messages';
import { transferModalStore, useIsOpen, useModalState } from './store';

export type ShowTransferModalArgs = {
	collectionAddress: `0x${string}`;
	collectibleId: string;
	chainId: number;
	collectionType?: ContractType;
	callbacks?: ModalCallbacks;
};

export const useTransferModal = () => {
	const { ensureCorrectChain } = useEnsureCorrectChain();

	const openModal = (args: ShowTransferModalArgs) => {
		transferModalStore.send({ type: 'open', ...args });
	};

	const handleShowModal = (args: ShowTransferModalArgs) => {
		const targetChainId = Number(args.chainId);

		ensureCorrectChain(targetChainId, {
			onSuccess: () => openModal(args),
		});
	};

	return {
		show: handleShowModal,
		close: () => transferModalStore.send({ type: 'close' }),
	};
};

export const TransferModal = () => {
	const isOpen = useIsOpen();
	if (!isOpen) return null;
	return <Modal />;
};

const Modal = () => {
	// ✅ Get essential modal state from store (following SellModal pattern)
	const {
		collectionAddress,
		collectibleId,
		chainId,
		quantity,
		receiverAddress,
		transferIsProcessing,
	} = useModalState();

	// ✅ Use consolidated modal data hook (like SellModal)
	const modalData = useModalData({
		chainId,
		collectionAddress,
	});

	// ✅ Local validation state - derived where possible
	const [isTransferring, setIsTransferring] = useState(false);

	const { address: connectedAddress } = useAccount();
	const { isWaaS } = useConnectorMetadata();
	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();

	// ✅ Collectible data (specific to this modal)
	const {
		isLoading: collectibleIsLoading,
		isError: collectibleIsError,
		error: collectibleError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});

	// ✅ Balance data
	const { data: tokenBalance } = useListBalances({
		chainId,
		contractAddress: collectionAddress,
		tokenId: collectibleId,
		accountAddress: connectedAddress,
		query: { enabled: !!connectedAddress },
	});

	// ✅ Transfer business logic
	const { transfer } = useHandleTransfer();

	// ✅ Derive processing states (following SellModal pattern)
	const isLoadingData = modalData.loading.any || collectibleIsLoading;
	const isProcessing = transferIsProcessing || isTransferring;

	const {
		shouldHideActionButton: shouldHideTransferButton,
		waasFeeOptionsShown,
		getActionLabel,
	} = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	// ✅ Enhanced error handling (following SellModal + MakeOfferModal pattern)
	const error =
		collectibleError ||
		modalData.errors.collection ||
		modalData.errors.currencies;

	// ✅ Derive validation states (no useState needed)
	const isWalletAddressValid = isAddress(receiverAddress);
	const balanceAmount = tokenBalance?.pages[0]?.balances[0]?.balance;

	let insufficientBalance = true;
	if (balanceAmount !== undefined && quantity) {
		try {
			const quantityBigInt = BigInt(quantity);
			insufficientBalance = quantityBigInt > BigInt(balanceAmount);
		} catch (_e) {
			insufficientBalance = true;
		}
	}

	const isSelfTransfer =
		isWalletAddressValid &&
		connectedAddress &&
		compareAddress(receiverAddress, connectedAddress);

	const isErc1155 = modalData.data.collection?.type === ContractType.ERC1155;
	const showQuantityInput = isErc1155 && !!balanceAmount;

	// ✅ Error modal conditions
	if (collectibleIsError || modalData.hasError) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={Number(chainId)}
				onClose={() => transferModalStore.send({ type: 'close' })}
				title="Transfer your item"
			/>
		);
	}

	// ✅ Simple handlers - no useCallback needed (following SellModal pattern)
	const handleTransfer = async () => {
		if (!modalData.data.collection?.type) {
			throw new InvalidContractTypeError(
				'unsupported',
				'ERC721 or ERC1155',
				modalData.data.collection?.type,
			);
		}

		setIsTransferring(true);
		try {
			if (isWaaS) {
				selectWaasFeeOptionsStore.send({ type: 'show' });
			}
			await transfer();
		} finally {
			setIsTransferring(false);
		}
	};

	const handleClose = () => {
		transferModalStore.send({ type: 'close' });
		selectWaasFeeOptionsStore.send({ type: 'hide' });
	};

	// ✅ Derive button states - no useMemo needed (following SellModal pattern)
	const transferCtaLabel = getActionLabel('Transfer');

	const isDisabled =
		!isWalletAddressValid ||
		insufficientBalance ||
		!quantity ||
		Number(quantity) === 0 ||
		isSelfTransfer;

	// ✅ Simple CTA configuration - derived inline (following SellModal pattern)
	const ctas = [
		{
			label: transferCtaLabel,
			onClick: handleTransfer,
			pending: isProcessing,
			disabled: isDisabled || isProcessing,
		},
	] satisfies ActionModalProps['ctas'];

	return (
		<ActionModal
			isOpen={true}
			chainId={Number(chainId)}
			onClose={handleClose}
			title="Transfer your item"
			ctas={ctas}
			modalLoading={isLoadingData}
			spinnerContainerClassname="h-[280px]"
			hideCtas={shouldHideTransferButton}
			error={error}
			onErrorDismiss={() => {
				// Note: Reset functionality will be handled by the actions hook internally
				// For now, we let ActionModal handle error dismissal
			}}
			onErrorAction={(error, action) => {
				// Handle smart error actions
				console.log('Error action triggered:', action.type, error.name);
				if (action.type === 'retry') {
					// Retry the failed operation
					handleTransfer();
				}
			}}
			errorPosition="bottom"
		>
			<div className="grid grow gap-6">
				<TokenPreview
					collectionName={modalData.data.collection?.name}
					collectionAddress={collectionAddress}
					collectibleId={collectibleId}
					chainId={chainId}
				/>

				<div className="flex flex-col gap-3">
					<AlertMessage
						message={getMessage('enterReceiverAddress')}
						type="warning"
					/>

					<WalletAddressInput />

					{showQuantityInput && (
						<TokenQuantityInput
							balanceAmount={balanceAmount ? BigInt(balanceAmount) : undefined}
							collection={modalData.data.collection}
							isProcessingWithWaaS={waasFeeOptionsShown ?? false}
						/>
					)}
				</div>
			</div>

			{waasFeeOptionsShown && (
				<SelectWaasFeeOptions
					chainId={Number(chainId)}
					onCancel={() => {
						setIsTransferring(false);
					}}
					titleOnConfirm="Processing transfer..."
				/>
			)}

			{/* 🆕 Enhanced error handling moved to ActionModal - no need for manual ErrorDisplay */}
		</ActionModal>
	);
};
