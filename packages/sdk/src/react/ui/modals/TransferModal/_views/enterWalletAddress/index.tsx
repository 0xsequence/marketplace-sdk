import { Box, Button, Text, TextInput } from '@0xsequence/design-system';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import AlertMessage from '../../../_internal/components/alertMessage';
import QuantityInput from '../../../_internal/components/quantityInput';
import { transferModal$ } from '../../_store';
import getMessage from '../../messages';
import useHandleTransfer from './useHandleTransfer';
import { useCollection, useListBalances } from '../../../../..';
import { type CollectionType, ContractType } from '../../../../../_internal';
import { useTransactionStatusModal } from '../../../_internal/components/transactionStatusModal';
import { TransactionType } from '../../../../../_internal/transaction-machine/execute-transaction';
import { ModalCallbacks } from '../../../_internal/types';

const EnterWalletAddressView = () => {
	const { address } = useAccount();
	const {
		collectionAddress,
		collectibleId,
		chainId,
		collectionType,
		callbacks,
	} = transferModal$.state.get();
	const $quantity = transferModal$.state.quantity;
	const isWalletAddressValid = isAddress(
		transferModal$.state.receiverAddress.get(),
	);
	const { data: tokenBalance } = useListBalances({
		chainId,
		contractAddress: collectionAddress,
		tokenId: collectibleId,
		accountAddress: address!,
		query: { enabled: !!address },
	});
	const balanceAmount = tokenBalance?.pages[0].balances[0].balance;
	const insufficientBalance: boolean = $quantity.get() > balanceAmount!;
	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
	});
	transferModal$.state.collectionType.set(
		collection?.type as CollectionType | undefined,
	);
	const { transfer } = useHandleTransfer();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	function handleChangeWalletAddress(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		transferModal$.state.receiverAddress.set(event.target.value);
	}

	async function handleChangeView() {
		transfer()
			.then((hash) => {
				showTransactionStatusModal({
					collectionAddress,
					collectibleId,
					chainId,
					hash: hash!,
					callbacks: callbacks as ModalCallbacks,
					type: TransactionType.TRANSFER,
				});
			})
			.catch(() => {
				transferModal$.view.set('enterReceiverAddress');
			});
		transferModal$.view.set('followWalletInstructions');
	}

	return (
		<Box display="grid" gap="6" flexGrow="1">
			<Text color="white" fontSize="large" fontWeight="bold" fontFamily="body">
				Transfer your item
			</Text>

			<Box display="flex" flexDirection="column" gap="3">
				<AlertMessage
					message={getMessage('enterReceiverAddress')}
					type="warning"
				/>

				<TextInput
					label="Wallet address"
					labelLocation="top"
					value={transferModal$.state.receiverAddress.get()}
					onChange={handleChangeWalletAddress}
					name="walletAddress"
					placeholder="Enter wallet address of recipient"
				/>

				{collectionType === ContractType.ERC1155 && balanceAmount && (
					<>
						<QuantityInput
							$quantity={$quantity}
							chainId={chainId}
							collectionAddress={collectionAddress}
							collectibleId={collectibleId}
						/>

						<Text
							color={insufficientBalance ? 'negative' : 'text50'}
							fontSize="small"
							fontWeight="medium"
							fontFamily="body"
						>
							{`You have ${balanceAmount} of this item`}
						</Text>
					</>
				)}
			</Box>

			<Button
				onClick={handleChangeView}
				disabled={!isWalletAddressValid || insufficientBalance}
				title="Transfer"
				label="Transfer"
				variant="primary"
				shape="square"
				size="sm"
				justifySelf="flex-end"
				paddingX="10"
			/>
		</Box>
	);
};

export default EnterWalletAddressView;
