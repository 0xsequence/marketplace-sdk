import { type ErrorCode, ErrorCodes } from './_internal/error/codes';
import {
	type SdkError,
	isErrorWithCode,
	isSdkError,
} from './_internal/error/factory';
import { type ErrorDetails, ErrorRegistry } from './_internal/error/registry';

export { ErrorCodes };

export type { ErrorCode };

export { ErrorRegistry };

export type { ErrorDetails };

export type { SdkError };

export { isErrorWithCode };

export { isSdkError };
