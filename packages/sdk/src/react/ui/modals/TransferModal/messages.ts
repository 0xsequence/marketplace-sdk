type MessageKey =
	| 'enterWalletAddress'
	| 'followWalletInstructions'
	| 'transferProcessing'
	| 'transferCompleted';

const baseMessages: Record<MessageKey, string> = {
	enterWalletAddress:
		"Items sent to the wrong wallet address can't be recovered!",
	followWalletInstructions:
		"Follow your wallet's instructions to submit a transaction to transfer your assets.",
	transferProcessing:
		'You just transferred {collectibleName}. It should be confirmed on the blockchain shortly.',
	transferCompleted:
		"You just transferred {collectibleName}. It's been confirmed on the blockchain!",
};

export default function getMessage(
	key: MessageKey,
	collectibleName?: string,
): string {
	const message = baseMessages[key];

	if (
		collectibleName &&
		(key === 'transferProcessing' || key === 'transferCompleted')
	) {
		return message.replace('{collectibleName}', collectibleName);
	}

	return message;
}
