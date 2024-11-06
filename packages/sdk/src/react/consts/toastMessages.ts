import { UserRejectedRequestError } from 'viem';
import { SwitchChainNotSupportedError } from 'wagmi';

const marketplaceToastMessages = {
	tokenApproval: {
		unkownError: {
			name: 'unknown',
			title: 'Error while approving token',
			description: 'An error occurred while approving the token',
		},
		success: {
			name: 'success',
			title: 'Token approved',
			description: 'The token has been approved successfully.',
		},
	},
	// Switch chain errors: https://wagmi.sh/react/api/errors
	switchChain: {
		switchingNotSupported: {
			name: SwitchChainNotSupportedError.name,
			title: 'Chain switch not supported',
			description:
				'Switching chain is not supported currently. Please switch manually.',
		},
		userRejectedRequest: {
			name: UserRejectedRequestError.name,
			title: 'Switching is needed',
			description: 'You need to switch network to continue.',
		},
		unknownError: {
			name: 'unknown',
			title: 'Error while switching network',
			description: 'There was an error while switching network.',
		},
		success: {
			name: 'success',
			title: 'Network switched',
			description: 'The network has been switched successfully.',
		},
	},
	sellCollectible: {
		unkownError: {
			name: 'unknown',
			title: 'Error while selling collectible',
			description: 'An error occurred while accepting the offer',
		},
		success: {
			name: 'success',
			title: 'Offer accepted',
			description: 'The collectible has been sold successfully.',
		},
	},
} as const;

export default marketplaceToastMessages;
