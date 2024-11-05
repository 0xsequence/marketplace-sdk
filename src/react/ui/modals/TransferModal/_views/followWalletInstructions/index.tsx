import { observer } from '@legendapp/state/react';
import AlertMessage from '../../../_internal/components/alertMessage';
import getMessage from '../../messages';
import { Box, Button, Text } from '@0xsequence/design-system';
import { ContractType } from '@internal';
import { transferModal$ } from '../../_store';
import { useCollection } from '@react-hooks/useCollection';
import { useTransferTokens } from '@react-hooks/useTransferTokens';
import { Hex } from 'viem';
import { useTransactionStatusModal } from '../../../_internal/components/transactionStatusModal';
import {
	getTransferTransactionMessage,
	getTransferTransactionTitle,
} from '../../_utils/getTransferTransactionTitleMessage';
import { useCollectible } from '@react-hooks/useCollectible';
import { useEffect } from 'react';

const FollowWalletInstructionsView = observer(() => {
	const {
		receiverAddress,
		collectionAddress,
		tokenId,
		quantity,
		chainId,
		messages,
	} = transferModal$.state.get();
	const { transferTokensAsync, hash } = useTransferTokens();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const { data: collection, isSuccess: collectionSuccess } = useCollection({
		collectionAddress,
		chainId,
	});
	const { data: collectible, isSuccess: collectibleSuccess } = useCollectible({
		collectionAddress,
		collectibleId: tokenId,
		chainId,
	});

	useEffect(() => {
		if (!hash && collectionSuccess) {
			transfer();
		}
	}, [collectionSuccess, collectibleSuccess, hash]);

	async function transfer() {
		if (collection!.type === ContractType.ERC721) {
			try {
				const hash = await transferTokensAsync({
					receiverAddress: receiverAddress as Hex,
					collectionAddress,
					tokenId,
					chainId,
					contractType: ContractType.ERC721,
				});

				transferModal$.close();

				showTransactionStatusModal({
					hash: hash,
					collectionAddress,
					chainId,
					tokenId,
					price: undefined,
					getTitle: getTransferTransactionTitle,
					getMessage: (params) =>
						getTransferTransactionMessage(params, collectible!.name),
					type: 'transfer',
				});
			} catch (error) {
				messages?.transferCollectibles?.onUnknownError &&
					messages.transferCollectibles.onUnknownError(error);
			}
		}

		try {
			const hash = await transferTokensAsync({
				receiverAddress: receiverAddress as Hex,
				collectionAddress,
				tokenId,
				chainId,
				contractType: ContractType.ERC1155,
				quantity: String(quantity),
			});

			transferModal$.close();

			showTransactionStatusModal({
				hash: hash,
				collectionAddress,
				chainId,
				tokenId,
				price: undefined,
				getTitle: getTransferTransactionTitle,
				getMessage: (params) =>
					getTransferTransactionMessage(params, collectible!.name),
				type: 'transfer',
			});
		} catch (error) {
			messages?.transferCollectibles?.onUnknownError &&
				messages.transferCollectibles.onUnknownError(error);
		}
	}
	return (
		<Box display="grid" gap="6" flexGrow="1">
			<Text color="white" fontSize="large" fontWeight="bold">
				Transfer your item
			</Text>

			<Box display="flex" flexDirection="column" gap="3">
				<AlertMessage
					message={getMessage('followWalletInstructions')}
					type="info"
				/>
			</Box>

			<Button
				disabled={true}
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
});

export default FollowWalletInstructionsView;
