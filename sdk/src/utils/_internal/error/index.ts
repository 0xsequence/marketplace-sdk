export { BaseError } from './base';

export { ErrorCodes } from './codes';
export type { ErrorCode } from './codes';

export { ErrorRegistry } from './registry';
export type { ErrorDetails } from './registry';

export {
	createError,
	createTransactionError,
	createUserRejectionError,
	isErrorWithCode,
	isSdkError,
} from './factory';
export type { CreateErrorOptions, SdkError } from './factory';

// These can be deprecated in the future
export * from './transaction';
export * from './config';
export * from './context';
