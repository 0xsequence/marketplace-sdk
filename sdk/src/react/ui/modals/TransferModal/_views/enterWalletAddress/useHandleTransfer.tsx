import { ContractType } from '@0xsequence/api-client';
import { useWaasFeeOptions } from '@0xsequence/connect';
import type { Address, Hex } from 'viem';
import { InvalidContractTypeError } from '../../../../../../utils/_internal/error/transaction';

import { TransactionType } from '../../../../../_internal/types';
import { useConnectorMetadata } from '../../../../../hooks/config/useConnectorMetadata';
import { useCollectionDetail, useTransferTokens } from '../../../../hooks';
import { useTransactionStatusModal } from '../../../_internal/components/transactionStatusModal';
import { transferModalStore, useModalState } from '../../store';

const useHandleTransfer = () => {
	const { receiverAddress, collectionAddress, tokenId, quantity, chainId } =
		useModalState();

	const { transferTokensAsync } = useTransferTokens();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const { isWaaS } = useConnectorMetadata();
	const [pendingFeeOptionConfirmation] = useWaasFeeOptions();

	const { data: collection } = useCollectionDetail({
		collectionAddress,
		chainId,
	});

	const collectionType = collection?.type;

	const getHash = async (): Promise<Hex> => {
		const baseParams = {
			// receiverAddress is validated by isAddress() in WalletAddressInput before transfer is enabled
			receiverAddress: receiverAddress as Address,
			collectionAddress,
			tokenId,
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
				tokenId,
				type: TransactionType.TRANSFER,
				queriesToInvalidate: [
					['token', 'balances'],
					['collection', 'balance-details'],
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
