import { useWaasFeeOptions } from '@0xsequence/connect';
import type { Hex } from 'viem';
import { ContractType } from '../../../../../../types';
import { InvalidContractTypeError } from '../../../../../../utils/_internal/error/transaction';
import { balanceQueries, collectableKeys } from '../../../../../_internal';
import { TransactionType } from '../../../../../_internal/types';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
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
	const { wallet } = useWallet();
	const [pendingFeeOptionConfirmation] = useWaasFeeOptions();

	const getHash = async (): Promise<Hex> => {
		const baseParams = {
			receiverAddress: receiverAddress as Hex,
			collectionAddress,
			tokenId: collectibleId,
			chainId,
		};

		if (collectionType === ContractType.ERC721) {
			return await transferTokensAsync({
				...baseParams,
				contractType: ContractType.ERC721,
			});
		}

		// For ERC1155
		return await transferTokensAsync({
			...baseParams,
			contractType: ContractType.ERC1155,
			quantity: String(quantity),
		});
	};

	const transfer = async (): Promise<void> => {
		if (
			collectionType !== ContractType.ERC721 &&
			collectionType !== ContractType.ERC1155
		) {
			throw new InvalidContractTypeError(collectionType);
		}

		if (wallet?.isWaaS && pendingFeeOptionConfirmation) {
			return;
		}

		try {
			const hash = await getHash();
			transferModal$.close();

			showTransactionStatusModal({
				hash,
				collectionAddress,
				chainId,
				collectibleId,
				type: TransactionType.TRANSFER,
				queriesToInvalidate: [
					balanceQueries.all,
					balanceQueries.collectionBalanceDetails,
					collectableKeys.userBalances,
				],
			});
		} catch (error) {
			transferModal$.view.set('enterReceiverAddress');
			callbacks?.onError?.(error as Error);
		}
	};

	return { transfer };
};

export default useHandleTransfer;
