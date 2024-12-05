import type { Hex } from 'viem';
import { ContractType } from '../../../../../../types';
import { useTransferTokens } from '../../../../../hooks';
import { transferModal$ } from '../../_store';

const useHandleTransfer = () => {
	const {
		receiverAddress,
		collectionAddress,
		tokenId,
		quantity,
		chainId,
		collectionType,
		errorCallbacks,
	} = transferModal$.state.get();
	const { transferTokensAsync } = useTransferTokens();

	async function transfer() {
		if (
			collectionType !== ContractType.ERC721 &&
			collectionType !== ContractType.ERC1155
		) {
			throw new Error('Invalid contract type');
		}

		if (collectionType === ContractType.ERC721) {
			try {
				await transferTokensAsync({
					receiverAddress: receiverAddress as Hex,
					collectionAddress,
					tokenId,
					chainId,
					contractType: ContractType.ERC721,
				});

				transferModal$.close();
			} catch (error) {
				transferModal$.view.set('enterReceiverAddress');

				errorCallbacks?.onTransferError?.(error);
			}
		}

		if (collectionType === ContractType.ERC1155) {
			try {
				await transferTokensAsync({
					receiverAddress: receiverAddress as Hex,
					collectionAddress,
					tokenId,
					chainId,
					contractType: ContractType.ERC1155,
					quantity: String(quantity),
				});

				transferModal$.close();
			} catch (error) {
				transferModal$.view.set('enterReceiverAddress');

				errorCallbacks?.onTransferError?.(error);
			}
		}
	}

	return { transfer };
};

export default useHandleTransfer;
