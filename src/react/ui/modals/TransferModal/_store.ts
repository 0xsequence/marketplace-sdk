import { observable, when } from '@legendapp/state';
import type { ShowTransferModalArgs } from '.';
import { ContractType } from '@types';
import { Hex } from 'viem';
import { Messages } from '../../../../types/messages';
import {
	TransferTokensParams,
	useTransferTokens,
} from '@react-hooks/useTransferTokens';
import { useCollection } from '@react-hooks/useCollection';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import {
	getTransferTransactionMessage,
	getTransferTransactionTitle,
} from './_utils/getTransferTransactionTitleMessage';
import { useCollectible } from '@react-hooks/useCollectible';

export interface TransferModalState {
	isOpen: boolean;
	open: (args: ShowTransferModalArgs) => void;
	close: () => void;
	state: {
		chainId: string;
		collectionAddress: Hex;
		tokenId: string;
		quantity?: string;
		receiverAddress: string;
		messages?: Messages;
	};
	view: 'enterReceiverAddress' | 'followWalletInstructions' | undefined;
	hash: Hex | undefined;
}

export const initialState: TransferModalState = {
	isOpen: false,
	open: ({
		receiverAddress,
		chainId,
		collectionAddress,
		tokenId,
		quantity,
		messages,
	}: ShowTransferModalArgs) => {
		transferModal$.state.set({
			...transferModal$.state.get(),
			receiverAddress,
			chainId,
			collectionAddress,
			tokenId,
			quantity,
			messages,
		});
		transferModal$.isOpen.set(true);
	},
	close: () => {
		transferModal$.isOpen.set(false);
		transferModal$.state.set({
			...initialState.state,
		});
	},
	state: {
		receiverAddress: '',
		collectionAddress: '0x',
		chainId: '',
		tokenId: '',
	},
	view: 'enterReceiverAddress',
	hash: undefined,
};

export const transferModal$ = observable(initialState);

export const useHydrate = () => {
	const { chainId, collectionAddress, tokenId } = transferModal$.state.get();
	const { transferTokens, hash } = useTransferTokens();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const { data: collectible } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId: tokenId,
	});

	const { isOpen, view } = transferModal$.get();

	when(
		() => isOpen && view === 'followWalletInstructions',
		() => transfer({ transferTokensCallback: transferTokens }),
	);

	when(
		() => isOpen && view === 'followWalletInstructions' && hash,
		() => {
			showTransactionStatusModal({
				hash: hash!,
				collectionAddress,
				chainId,
				tokenId,
				getTitle: getTransferTransactionTitle,
				getMessage: (params) =>
					getTransferTransactionMessage(params, collectible?.name || ''),
				type: 'transfer',
			});
			transferModal$.view.set('enterReceiverAddress');
			transferModal$.close();
		},
	);
};

function transfer({
	transferTokensCallback,
}: {
	transferTokensCallback: (params: TransferTokensParams) => void;
}) {
	const { receiverAddress, chainId, collectionAddress, tokenId, quantity } =
		transferModal$.state.get();
	const { data: collection } = useCollection({ chainId, collectionAddress });
	const collectionType = collection?.type;

	if (
		collectionType !== ContractType.ERC721 &&
		collectionType !== ContractType.ERC1155
	) {
		throw new Error('Invalid collection type');
	}

	if (collectionType === ContractType.ERC721) {
		transferTokensCallback({
			receiverAddress: receiverAddress as Hex,
			collectionAddress,
			tokenId,
			chainId,
			contractType: ContractType.ERC721,
		});
	}

	transferTokensCallback({
		receiverAddress: receiverAddress as Hex,
		collectionAddress,
		tokenId,
		chainId,
		contractType: ContractType.ERC1155,
		quantity: String(quantity),
	});
}
