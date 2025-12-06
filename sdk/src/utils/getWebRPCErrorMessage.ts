import type { WebrpcError } from '@0xsequence/api-client';

export const getWebRPCErrorMessage = (error: WebrpcError): string => {
	switch (error.code) {
		// Protocol Errors (negative numbers)
		case -1: // WebrpcRequestFailed
			return 'Connection failed. Please check your internet and try again.';
		case -2: // WebrpcBadRoute
			return 'Invalid request. Please try again.';
		case -3: // WebrpcBadMethod
			return 'Unsupported operation. Please contact support.';
		case -4: // WebrpcBadRequest
			return 'Invalid request format. Please try again.';
		case -5: // WebrpcBadResponse
			return 'Server response error. Please try again.';
		case -6: // WebrpcServerPanic
			return 'Server error. Please try again in a moment.';
		case -7: // WebrpcInternalError
			return 'Server internal error. Please try again.';
		case -8: // WebrpcClientDisconnected
			return 'Connection lost. Please refresh and try again.';
		case -9: // WebrpcStreamLost
			return 'Connection interrupted. Please try again.';
		case -10: // WebrpcStreamFinished
			return 'Operation completed. Please refresh if needed.';

		// Authentication & Authorization (1000s)
		case 1000: // Unauthorized
			return 'Please sign in to continue.';
		case 1001: // PermissionDenied
			return 'You do not have permission for this action.';
		case 1002: // SessionExpired
			return 'Session expired. Please sign in again.';
		case 1003: // MethodNotFound
			return 'Operation not available. Please contact support.';

		// Request Issues (2000s)
		case 2000: // Timeout
			return 'Request timed out. Please try again.';
		case 2001: // InvalidArgument
			return 'Invalid input. Please check your information.';

		// Resource Issues (3000s)
		case 3000: // NotFound
			return 'Item not found or no longer available.';
		case 3001: // UserNotFound
			return 'User not found. Please check the account.';
		case 3002: // ProjectNotFound
			return 'Project not found. Please verify the project.';
		case 3003: // InvalidTier
			return 'Invalid tier. Please contact support.';
		case 3005: // ProjectLimitReached
			return 'Project limit reached. Please upgrade your account.';

		// Not Implemented
		case 9999: // NotImplemented
			return 'Feature not yet available. Please try again later.';

		// Default fallback
		default:
			return 'Something went wrong. Please try again.';
	}
};
