'use client';

import { Text } from '@0xsequence/design-system';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import type { FeeOption } from '../../../../../../types/waas-types';
import { compareAddress } from '../../../../../../utils';
import { useCollectionDetail, useTokenBalances } from '../../../../..';
import { ContractType } from '../../../../../_internal';
import AlertMessage from '../../../_internal/components/alertMessage';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../../_internal/components/selectWaasFeeOptions/store';
import { useSelectWaasFeeOptions } from '../../../_internal/hooks/useSelectWaasFeeOptions';
import getMessage from '../../messages';
import { transferModalStore, useModalState } from '../../store';
import TokenQuantityInput from './_components/TokenQuantityInput';
import TransferButton from './_components/TransferButton';
import WalletAddressInput from './_components/WalletAddressInput';
import useHandleTransfer from './useHandleTransfer';

const EnterWalletAddressView = () => {
	const { address: connectedAddress } = useAccount();
	const {
		collectionAddress,
		tokenId,
		chainId,
		quantity,
		receiverAddress,
		transferIsProcessing,
	} = useModalState();

	const isWalletAddressValid = isAddress(receiverAddress);
	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();
	const {
		isWaaS,
		isProcessingWithWaaS,
		shouldHideActionButton: shouldHideTransferButton,
	} = useSelectWaasFeeOptions({
		isProcessing: transferIsProcessing,
		feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	const isSelfTransfer =
		isWalletAddressValid &&
		connectedAddress &&
		compareAddress(receiverAddress, connectedAddress);

	const { data: tokenBalance } = useTokenBalances({
		chainId,
		contractAddress: collectionAddress,
		tokenId,
		accountAddress: connectedAddress,
		query: { enabled: !!connectedAddress },
	});

	const balanceAmount = tokenBalance?.pages[0].balances[0].balance;

	let insufficientBalance = true;
	if (balanceAmount !== undefined && quantity) {
		try {
			const quantityBigInt = BigInt(quantity);
			insufficientBalance = quantityBigInt > BigInt(balanceAmount);
		} catch (_e) {
			insufficientBalance = true;
		}
	}

	const { data: collection } = useCollectionDetail({
		collectionAddress,
		chainId,
	});

	const { transfer } = useHandleTransfer();

	const onTransferClick = async () => {
		transferModalStore.send({ type: 'startTransfer' });

		try {
			if (isWaaS) {
				selectWaasFeeOptionsStore.send({ type: 'show' });
			}

			await transfer();
		} catch (error) {
			console.error('Transfer failed:', error);
		}
	};

	const isErc1155 = collection?.type === ContractType.ERC1155;
	const showQuantityInput = isErc1155 && !!balanceAmount;

	const isTransferDisabled =
		transferIsProcessing ||
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
				/>
			)}
		</div>
	);
};

export default EnterWalletAddressView;
