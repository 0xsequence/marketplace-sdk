import { Button, Text, TextInput } from '@0xsequence/design-system';
import { observable } from '@legendapp/state';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useCollection, useListBalances } from '../../../../..';
import { type CollectionType, ContractType } from '../../../../../_internal';
import AlertMessage from '../../../_internal/components/alertMessage';
import QuantityInput from '../../../_internal/components/quantityInput';
import { transferModal$ } from '../../_store';
import getMessage from '../../messages';
import useHandleTransfer from './useHandleTransfer';

const EnterWalletAddressView = () => {
	const { address } = useAccount();
	const { collectionAddress, collectibleId, chainId, collectionType } =
		transferModal$.state.get();
	const $quantity = transferModal$.state.quantity;
	const $invalidQuantity = observable(false);
	const isWalletAddressValid = isAddress(
		transferModal$.state.receiverAddress.get(),
	);
	const { data: tokenBalance } = useListBalances({
		chainId,
		contractAddress: collectionAddress,
		tokenId: collectibleId,
		accountAddress: address ?? '',
		query: { enabled: !!address },
	});
	const balanceAmount = tokenBalance?.pages[0].balances[0].balance;
	const insufficientBalance: boolean = balanceAmount
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

	function handleChangeWalletAddress(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		transferModal$.state.receiverAddress.set(event.target.value);
	}

	function handleChangeView() {
		transfer();
		transferModal$.view.set('followWalletInstructions');
	}

	return (
		<div className="grid gap-6 grow">
			<Text className="text-xl font-body" color="white" fontWeight="bold">
				Transfer your item
			</Text>
			<div className="flex flex-col gap-3">
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
							$invalidQuantity={$invalidQuantity}
							decimals={collection?.decimals || 0}
							maxQuantity={balanceAmount}
						/>

						<Text
							className="text-sm font-body"
							color={insufficientBalance ? 'negative' : 'text50'}
							fontWeight="medium"
						>
							{`You have ${balanceAmount} of this item`}
						</Text>
					</>
				)}
			</div>
			<Button
				className="flex justify-self-end px-10"
				onClick={handleChangeView}
				disabled={
					!isWalletAddressValid || insufficientBalance || !$quantity.get()
				}
				title="Transfer"
				label="Transfer"
				variant="primary"
				shape="square"
				size="sm"
			/>
		</div>
	);
};

export default EnterWalletAddressView;
