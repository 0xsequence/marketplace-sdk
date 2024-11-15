import { useTransferTokens } from '@react-hooks/useTransferTokens';
import { useTransactionStatusModal } from '../../../_internal/components/transactionStatusModal';
import { balanceQueries, ContractType } from '@internal';
import { useCollectible } from '@react-hooks/useCollectible';
import {
	getTransferTransactionMessage,
	getTransferTransactionTitle,
} from '../../_utils/getTransferTransactionTitleMessage';
import { transferModal$ } from '../../_store';
import { Hex } from 'viem';
import { QueryKey } from '@tanstack/react-query';

const useHandleTransfer = () => {
	const {
		receiverAddress,
		collectionAddress,
		tokenId,
		quantity,
		chainId,
		collectionType,
		successCallbacks,
		errorCallbacks,
	} = transferModal$.state.get();
	const { transferTokensAsync } = useTransferTokens();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const { data: collectible } = useCollectible({
		collectionAddress,
		collectibleId: tokenId,
		chainId,
	});

	async function transfer() {
		if (
			collectionType !== ContractType.ERC721 &&
			collectionType !== ContractType.ERC1155
		) {
			throw new Error('Invalid contract type');
		}

		if (collectionType === ContractType.ERC721) {
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
					callbacks: {
						onSuccess: successCallbacks?.onTransferSuccess,
						onUnknownError: errorCallbacks?.onTransferError,
					},
					queriesToInvalidate: balanceQueries.all as unknown as QueryKey[],
				});
			} catch (error) {
				transferModal$.view.set('enterReceiverAddress');

				errorCallbacks?.onTransferError?.(error);
			}
		}

		if (collectionType === ContractType.ERC1155) {
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
					callbacks: {
						onSuccess: successCallbacks?.onTransferSuccess,
						onUnknownError: errorCallbacks?.onTransferError,
					},
				});
			} catch (error) {
				transferModal$.view.set('enterReceiverAddress');

				errorCallbacks?.onTransferError?.(error);
			}
		}
	}

	return { transfer };
};

export default useHandleTransfer;
