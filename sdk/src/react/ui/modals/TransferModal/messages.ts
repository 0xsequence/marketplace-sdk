import type { TransferModalState } from './store';

type MessageKey = NonNullable<TransferModalState['view']>;

const baseMessages: Record<MessageKey, string> = {
	enterReceiverAddress:
		"Items sent to the wrong wallet address can't be recovered!",
	followWalletInstructions:
		"Follow your wallet's instructions to submit a transaction to transfer your assets.",
};

export default function getMessage(key: MessageKey): string {
	return baseMessages[key];
}
