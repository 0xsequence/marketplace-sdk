'use client';

import { Text } from '@0xsequence/design-system';
import { useSelector } from '@xstate/store/react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useCollection, useListBalances } from '../../../../..';
import type { FeeOption } from '../../../../../../types/waas-types';
import { compareAddress } from '../../../../../../utils';
import { type CollectionType, ContractType } from '../../../../../_internal';
import AlertMessage from '../../../_internal/components/alertMessage';
import {
	selectWaasFeeOptionsStore,
	useIsVisible as useSelectWaasFeeOptionsIsVisible,
	useSelectedFeeOption,
} from '../../../_internal/components/selectWaasFeeOptions/store';
import { useSelectWaasFeeOptions } from '../../../_internal/hooks/useSelectWaasFeeOptions';
import { transferModal$ } from '../../_store';
import getMessage from '../../messages';
import TokenQuantityInput from './_components/TokenQuantityInput';
import TransferButton from './_components/TransferButton';
import WalletAddressInput from './_components/WalletAddressInput';
import useHandleTransfer from './useHandleTransfer';

const EnterWalletAddressView = () => {
	const { address: connectedAddress } = useAccount();
	const modalState = useSelector(
		transferModal$,
		(state) => state.context.state,
	);
	const quantity = useSelector(
		transferModal$,
		(state) => state.context.state.quantity,
	);
	const receiverAddress = useSelector(
		transferModal$,
		(state) => state.context.state.receiverAddress,
	);
	const transferIsBeingProcessed = useSelector(
		transferModal$,
		(state) => state.context.state.transferIsBeingProcessed,
	);
	const feeOptionsVisible = useSelectWaasFeeOptionsIsVisible();
	const selectedFeeOption = useSelectedFeeOption();

	const { collectionAddress, collectibleId, chainId, collectionType } =
		modalState;
	const isWalletAddressValid = isAddress(receiverAddress);
	const {
		isWaaS,
		isProcessingWithWaaS,
		shouldHideActionButton: shouldHideTransferButton,
	} = useSelectWaasFeeOptions({
		isProcessing: transferIsBeingProcessed,
		feeOptionsVisible: feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	const isSelfTransfer =
		isWalletAddressValid &&
		connectedAddress &&
		compareAddress(receiverAddress, connectedAddress);

	const { data: tokenBalance } = useListBalances({
		chainId,
		contractAddress: collectionAddress,
		tokenId: collectibleId,
		accountAddress: connectedAddress,
		query: { enabled: !!connectedAddress },
	});

	const balanceAmount = tokenBalance?.pages[0].balances[0].balance;

	let insufficientBalance = true;
	if (balanceAmount !== undefined && quantity) {
		try {
			const quantityBigInt = BigInt(quantity);
			insufficientBalance = quantityBigInt > BigInt(balanceAmount);
		} catch (e) {
			insufficientBalance = true;
		}
	}

	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
	});

	// Update collection type when collection data is available
	if (collection?.type && collection.type !== collectionType) {
		transferModal$.send({
			type: 'setCollectionType',
			collectionType: collection.type as CollectionType,
		});
	}

	const { transfer } = useHandleTransfer();

	const onTransferClick = async () => {
		transferModal$.send({
			type: 'setTransferIsBeingProcessed',
			isProcessing: true,
		});

		try {
			if (!isWaaS) {
				transferModal$.send({
					type: 'setView',
					view: 'followWalletInstructions',
				});
			} else {
				selectWaasFeeOptionsStore.send({
					type: 'setVisible',
					isVisible: true,
				});
			}

			await transfer();
		} catch (error) {
			console.error('Transfer failed:', error);
		} finally {
			const currentView = transferModal$.getSnapshot().context.view;
			if (currentView === 'enterReceiverAddress') {
				transferModal$.send({
					type: 'setTransferIsBeingProcessed',
					isProcessing: false,
				});
			}
		}
	};

	const isErc1155 = collectionType === ContractType.ERC1155;
	const showQuantityInput = isErc1155 && !!balanceAmount;
	const isProcessing = !!transferIsBeingProcessed;

	const isTransferDisabled =
		isProcessing ||
		!isWalletAddressValid ||
		insufficientBalance ||
		!quantity ||
		Number(quantity) === 0 ||
		isSelfTransfer;

	return (
		<div className="grid grow gap-6">
			<Text className="font-body text-xl" color="white" fontWeight="bold">
				Transfer your item
			</Text>

			<div className="flex flex-col gap-3">
				<AlertMessage
					message={getMessage('enterReceiverAddress')}
					type="warning"
				/>

				<WalletAddressInput />

				{showQuantityInput && (
					<TokenQuantityInput
						balanceAmount={balanceAmount ? BigInt(balanceAmount) : undefined}
						collection={collection}
						isProcessingWithWaaS={isProcessingWithWaaS ?? false}
					/>
				)}
			</div>

			{!shouldHideTransferButton && (
				<TransferButton
					onClick={onTransferClick}
					isDisabled={isTransferDisabled}
					chainId={chainId}
				/>
			)}
		</div>
	);
};

export default EnterWalletAddressView;
