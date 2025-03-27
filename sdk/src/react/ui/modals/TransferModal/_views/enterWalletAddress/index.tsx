'use client';

import { Button, Spinner, Text, TextInput } from '@0xsequence/design-system';
import { observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useState } from 'react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useCollection, useListBalances } from '../../../../..';
import { type CollectionType, ContractType } from '../../../../../_internal';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import AlertMessage from '../../../_internal/components/alertMessage';
import QuantityInput from '../../../_internal/components/quantityInput';
import { transferModal$ } from '../../_store';
import getMessage from '../../messages';
import useHandleTransfer from './useHandleTransfer';

const EnterWalletAddressView = observer(() => {
	const { address: connectedAddress } = useAccount();
	const { collectionAddress, collectibleId, chainId, collectionType } =
		transferModal$.state.get();

	const $quantity = transferModal$.state.quantity;
	const $invalidQuantity = observable(false);
	const receiverAddress = transferModal$.state.receiverAddress.get();
	const isWalletAddressValid = isAddress(receiverAddress);

	const isSelfTransfer =
		isWalletAddressValid &&
		connectedAddress &&
		receiverAddress.toLowerCase() === connectedAddress.toLowerCase();

	const { wallet } = useWallet();

	const { data: tokenBalance } = useListBalances({
		chainId: Number(chainId),
		contractAddress: collectionAddress,
		tokenId: collectibleId,
		accountAddress: connectedAddress,
		query: { enabled: !!connectedAddress },
	});

	const balanceAmount = tokenBalance?.pages[0].balances[0].balance;
	const insufficientBalance = balanceAmount
		? $quantity.get() > balanceAmount
		: true;

	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
	});

	transferModal$.state.collectionType.set(
		collection?.type as CollectionType | undefined,
	);

	const { transfer } = useHandleTransfer();

	const handleChangeWalletAddress = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		transferModal$.state.receiverAddress.set(event.target.value);
	};

	const handleTransfer = async () => {
		transferModal$.state.transferIsBeingProcessed.set(true);

		try {
			if (!wallet?.isWaaS) {
				transferModal$.view.set('followWalletInstructions');
			}

			// Call transfer which handles both WaaS and non-WaaS cases
			await transfer();
		} catch (error) {
			console.error('Transfer failed:', error);
		} finally {
			// If we're still in the enterReceiverAddress view, we can reset the loading state
			if (transferModal$.view.get() === 'enterReceiverAddress') {
				transferModal$.state.transferIsBeingProcessed.set(false);
			}
		}
	};

	const isErc1155 = collectionType === ContractType.ERC1155;
	const showQuantityInput = isErc1155 && balanceAmount;
	const shouldHideTransferButton =
		transferModal$.state.transferIsBeingProcessed.get() && wallet?.isWaaS;
	const isTransferDisabled =
		transferModal$.state.transferIsBeingProcessed.get() ||
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

				<div className="[&>label>div>span]:text-sm [&>label>div>span]:text-text-80 [&>label]:gap-1">
					<TextInput
						label="Wallet address"
						labelLocation="top"
						autoFocus
						value={receiverAddress}
						onChange={handleChangeWalletAddress}
						name="walletAddress"
						placeholder="Enter wallet address"
						disabled={transferModal$.state.transferIsBeingProcessed.get()}
					/>
					{isSelfTransfer && (
						<div className="mt-1 text-negative text-sm">
							You cannot transfer to your own address
						</div>
					)}
				</div>

				{showQuantityInput && (
					<>
						<QuantityInput
							$quantity={$quantity}
							$invalidQuantity={$invalidQuantity}
							decimals={collection?.decimals || 0}
							maxQuantity={balanceAmount}
							className="[&>label>div>div]:h-13 [&>label>div>div]:rounded-xl [&>label>div>span]:text-sm [&>label>div>span]:text-text-80 [&>label]:gap-1"
						/>

						<Text
							className="font-body text-xs"
							color={insufficientBalance ? 'negative' : 'text50'}
							fontWeight="medium"
						>
							{`You have ${balanceAmount} of this item`}
						</Text>
					</>
				)}
			</div>

			{!shouldHideTransferButton && (
				<Button
					className="flex justify-self-end px-10"
					onClick={handleTransfer}
					disabled={isTransferDisabled}
					title="Transfer"
					label={
						transferModal$.state.transferIsBeingProcessed.get() ? (
							<div className="flex items-center justify-center gap-2">
								<Spinner size="sm" className="text-white" />
								<span>Transferring</span>
							</div>
						) : (
							'Transfer'
						)
					}
					variant="primary"
					shape="square"
					size="sm"
				/>
			)}
		</div>
	);
});

export default EnterWalletAddressView;
