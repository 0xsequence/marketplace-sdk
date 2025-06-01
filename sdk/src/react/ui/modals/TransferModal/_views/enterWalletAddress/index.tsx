'use client';

import { Text } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useCollection, useListBalances } from '../../../../..';
import type { FeeOption } from '../../../../../../types/waas-types';
import { compareAddress } from '../../../../../../utils';
import { ContractType } from '../../../../../_internal';
import AlertMessage from '../../../_internal/components/alertMessage';
import { selectWaasFeeOptions$ } from '../../../_internal/components/selectWaasFeeOptions/store';
import { useSelectWaasFeeOptions } from '../../../_internal/hooks/useSelectWaasFeeOptions';
import getMessage from '../../messages';
import { transferModalStore, useModalState, useView } from '../../store';
import TokenQuantityInput from './_components/TokenQuantityInput';
import TransferButton from './_components/TransferButton';
import WalletAddressInput from './_components/WalletAddressInput';
import useHandleTransfer from './useHandleTransfer';

const EnterWalletAddressView = observer(() => {
	const { address: connectedAddress } = useAccount();
	const modalState = useModalState();
	const view = useView();
	const {
		collectionAddress,
		collectibleId,
		chainId,
		collectionType,
		quantity,
		receiverAddress,
	} = modalState;
	const isWalletAddressValid = isAddress(receiverAddress);
	const {
		isWaaS,
		isProcessingWithWaaS,
		shouldHideActionButton: shouldHideTransferButton,
	} = useSelectWaasFeeOptions({
		isProcessing: modalState.transferIsBeingProcessed,
		feeOptionsVisible: selectWaasFeeOptions$.isVisible.get(),
		selectedFeeOption:
			selectWaasFeeOptions$.selectedFeeOption.get() as FeeOption,
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

	const { transfer } = useHandleTransfer();

	const onTransferClick = async () => {
		transferModalStore.send({
			type: 'setTransferIsBeingProcessed',
			isProcessing: true,
		});

		try {
			if (!isWaaS) {
				transferModalStore.send({
					type: 'setView',
					view: 'followWalletInstructions',
				});
			} else {
				selectWaasFeeOptions$.isVisible.set(true);
			}

			await transfer();
		} catch (error) {
			console.error('Transfer failed:', error);
		} finally {
			if (view === 'enterReceiverAddress') {
				transferModalStore.send({
					type: 'setTransferIsBeingProcessed',
					isProcessing: false,
				});
			}
		}
	};

	const isErc1155 = collectionType === ContractType.ERC1155;
	const showQuantityInput = isErc1155 && !!balanceAmount;
	const isProcessing = !!modalState.transferIsBeingProcessed;

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
});

export default EnterWalletAddressView;
