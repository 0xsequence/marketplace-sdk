import type { Hex } from 'viem';
import { ContractType } from '../../../../../../types';
import { InvalidContractTypeError } from '../../../../../../utils/_internal/error/transaction';
import { balanceQueries, collectableKeys } from '../../../../../_internal';
import { TransactionType } from '../../../../../_internal/transaction-machine/types';
import { useTransferTokens } from '../../../../../hooks';
import { useTransactionStatusModal } from '../../../_internal/components/transactionStatusModal';
import { transferModal$ } from '../../_store';

const useHandleTransfer = () => {
	const {
		receiverAddress,
		collectionAddress,
		collectibleId,
		quantity,
		chainId,
		collectionType,
		callbacks,
	} = transferModal$.state.get();
	const { transferTokensAsync } = useTransferTokens();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	const getHash = async () => {
		if (collectionType === ContractType.ERC721) {
			return await transferTokensAsync({
				receiverAddress: receiverAddress as Hex,
				collectionAddress,
				tokenId: collectibleId,
				chainId,
				contractType: ContractType.ERC721,
			});
		}

		// For ERC1155
		return await transferTokensAsync({
			receiverAddress: receiverAddress as Hex,
			collectionAddress,
			tokenId: collectibleId,
			chainId,
			contractType: ContractType.ERC1155,
			quantity: String(quantity),
		});
	};

	async function transfer() {
		if (
			collectionType !== ContractType.ERC721 &&
			collectionType !== ContractType.ERC1155
		) {
			throw new InvalidContractTypeError(collectionType);
		}

		try {
			const hash = await getHash();

			transferModal$.close();

			showTransactionStatusModal({
				hash: hash,
				collectionAddress,
				chainId,
				collectibleId,
				price: undefined,
				type: TransactionType.TRANSFER,
				queriesToInvalidate: [balanceQueries.all, collectableKeys.userBalances],
			});
		} catch (error) {
			transferModal$.view.set('enterReceiverAddress');

			callbacks?.onError?.(error as Error);
		}
	}

	return { transfer };
};

export default useHandleTransfer;
