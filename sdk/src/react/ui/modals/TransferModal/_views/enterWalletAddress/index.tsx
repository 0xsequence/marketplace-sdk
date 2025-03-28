'use client';

import { Text } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useCollection, useListBalances } from '../../../../..';
import { type CollectionType, ContractType } from '../../../../../_internal';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import AlertMessage from '../../../_internal/components/alertMessage';
import { waasFeeOptionsModal$ } from '../../../_internal/components/waasFeeOptionsBox/store';
import { transferModal$ } from '../../_store';
import getMessage from '../../messages';
import TokenQuantityInput from './_components/TokenQuantityInput';
import TransferButton from './_components/TransferButton';
import WalletAddressInput from './_components/WalletAddressInput';
import useHandleTransfer from './useHandleTransfer';

const EnterWalletAddressView = observer(() => {
	const { address: connectedAddress } = useAccount();
	const { collectionAddress, collectibleId, chainId, collectionType } =
		transferModal$.state.get();
	const $quantity = transferModal$.state.quantity;
	const receiverAddress = transferModal$.state.receiverAddress.get();
	const isWalletAddressValid = isAddress(receiverAddress);
	const { wallet } = useWallet();

	const isSelfTransfer =
		isWalletAddressValid &&
		connectedAddress &&
		receiverAddress.toLowerCase() === connectedAddress.toLowerCase();

	const { data: tokenBalance } = useListBalances({
		chainId: Number(chainId),
		contractAddress: collectionAddress,
		tokenId: collectibleId,
		accountAddress: connectedAddress,
		query: { enabled: !!connectedAddress },
	});

	const balanceAmount = tokenBalance?.pages[0].balances[0].balance;

	let insufficientBalance = true;
	if (balanceAmount !== undefined && $quantity.get()) {
		try {
			const quantityBigInt = BigInt($quantity.get());
			insufficientBalance = quantityBigInt > BigInt(balanceAmount);
		} catch (e) {
			insufficientBalance = true;
		}
	}

	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
	});

	transferModal$.state.collectionType.set(
		collection?.type as CollectionType | undefined,
	);

	const { transfer } = useHandleTransfer();

	const onTransferClick = async () => {
		transferModal$.state.transferIsBeingProcessed.set(true);

		try {
			if (!wallet?.isWaaS) {
				transferModal$.view.set('followWalletInstructions');
			} else {
				waasFeeOptionsModal$.isVisible.set(true);
			}

			await transfer();
		} catch (error) {
			console.error('Transfer failed:', error);
		} finally {
			if (transferModal$.view.get() === 'enterReceiverAddress') {
				transferModal$.state.transferIsBeingProcessed.set(false);
			}
		}
	};

	const isErc1155 = collectionType === ContractType.ERC1155;
	const showQuantityInput = isErc1155 && !!balanceAmount;
	const isProcessing = !!transferModal$.state.transferIsBeingProcessed.get();
	const isWaaS = !!wallet?.isWaaS;
	const isProcessingWithWaaS = isProcessing && isWaaS;

	const feeOptionsVisible = waasFeeOptionsModal$.isVisible.get();
	const shouldHideTransferButton =
		isProcessingWithWaaS && feeOptionsVisible === true;

	const isTransferDisabled =
		isProcessing ||
		!isWalletAddressValid ||
		insufficientBalance ||
		!$quantity.get() ||
		Number($quantity.get()) === 0 ||
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
						isProcessingWithWaaS={isProcessingWithWaaS}
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
});

export default EnterWalletAddressView;
