import { useWaasFeeOptions } from '@0xsequence/connect';
import type { Address, Hex } from 'viem';
import { ContractType } from '../../../../../../types';
import { InvalidContractTypeError } from '../../../../../../utils/errors';
import { balanceQueries, collectableKeys } from '../../../../../_internal';
import { TransactionType } from '../../../../../_internal/types';
import { useCollection, useTransferTokens } from '../../../../../hooks';
import { useConnectorMetadata } from '../../../../../hooks/config/useConnectorMetadata';
import { useTransactionStatusModal } from '../../../_internal/components/transactionStatusModal';
import { transferModalStore, useModalState } from '../../store';

const useHandleTransfer = () => {
	const {
		receiverAddress,
		collectionAddress,
		collectibleId,
		quantity,
		chainId,
	} = useModalState();

	const { transferTokensAsync } = useTransferTokens();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const { isWaaS } = useConnectorMetadata();
	const [pendingFeeOptionConfirmation] = useWaasFeeOptions();

	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
	});

	const collectionType = collection?.type;

	const getHash = async (): Promise<Hex> => {
		const baseParams = {
			receiverAddress: receiverAddress as Address,
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
			throw new InvalidContractTypeError(
				'unsupported',
				'ERC721 or ERC1155',
				collectionType,
			);
		}

		if (isWaaS && pendingFeeOptionConfirmation) {
			return;
		}

		try {
			const hash = await getHash();

			transferModalStore.send({ type: 'completeTransfer', hash });
			transferModalStore.send({ type: 'close' });

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
			transferModalStore.send({
				type: 'failTransfer',
				error: error as Error,
			});
		}
	};

	return { transfer };
};

export default useHandleTransfer;
