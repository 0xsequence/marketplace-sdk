import type { Hex } from 'viem';
import { ContractType } from '../../../../../../types';
import { InvalidContractTypeError } from '../../../../../../utils/_internal/error/transaction';
import { useTransferTokens } from '../../../../../hooks';
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

	async function transfer() {
		if (
			collectionType !== ContractType.ERC721 &&
			collectionType !== ContractType.ERC1155
		) {
			throw new InvalidContractTypeError(collectionType);
		}

		if (collectionType === ContractType.ERC721) {
			try {
				const hash = await transferTokensAsync({
					receiverAddress: receiverAddress as Hex,
					collectionAddress,
					tokenId: collectibleId,
					chainId,
					contractType: ContractType.ERC721,
				});

				transferModal$.close();
				return hash;
			} catch (error) {
				transferModal$.view.set('enterReceiverAddress');

				callbacks?.onError?.(error as Error);
			}
		}

		if (collectionType === ContractType.ERC1155) {
			try {
				const hash = await transferTokensAsync({
					receiverAddress: receiverAddress as Hex,
					collectionAddress,
					tokenId: collectibleId,
					chainId,
					contractType: ContractType.ERC1155,
					quantity: String(quantity),
				});

				transferModal$.close();
				return hash;
			} catch (error) {
				transferModal$.view.set('enterReceiverAddress');

				callbacks?.onError?.(error as Error);
			}
		}
	}

	return { transfer };
};

export default useHandleTransfer;
