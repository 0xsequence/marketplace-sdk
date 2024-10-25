import { UserRejectedRequestError } from 'viem';
import { SwitchChainNotSupportedError } from 'wagmi';

const marketplaceErrorMessages = {
	tokenApproval: {
		default: {
			name: 'unknown',
			title: 'Error while approving token',
			description: 'An error occurred while approving the token',
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
		unknown: {
			name: 'unknown',
			title: 'Error while switching network',
			description: 'There was an error while switching network.',
		},
	},
} as const;

export default marketplaceErrorMessages;
