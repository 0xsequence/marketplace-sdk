import { BaseError } from './base';
import type { ErrorCode } from './codes';
import type { ErrorDetails } from './registry';
import { ErrorRegistry } from './registry';

export interface SdkError extends BaseError {
	code: ErrorCode;
	details: string;
	severity: ErrorDetails['severity'];
	cause?: Error;
	docsUrl?: string;
}

export interface CreateErrorOptions {
	details?: string;
	cause?: Error;
	params?: Record<string, string | number | undefined>;
	docsUrl?: string;
}

/**
 * Create a standardized SDK error with a code from the registry
 *
 * @param code - Error code from the ErrorCodes enum
 * @param options - Additional error options
 * @returns A standardized SdkError object
 */
export function createError(
	code: ErrorCode,
	options: CreateErrorOptions = {},
): SdkError {
	const registryEntry = ErrorRegistry[code];

	if (!registryEntry) {
		throw new Error(`Unknown error code: ${code}`);
	}

	let details = options.details || registryEntry.details || '';

	if (options.params && Object.keys(options.params).length > 0) {
		const paramsStr = Object.entries(options.params)
			.filter(([_, value]) => value !== undefined)
			.map(([key, value]) => `${key}: ${value}`)
			.join(', ');

		if (paramsStr) {
			details = details ? `${details} (${paramsStr})` : paramsStr;
		}
	}

	const errorOptions: Record<string, unknown> = {
		details,
		docsUrl: options.docsUrl || registryEntry.docsUrl,
	};

	if (options.cause) {
		errorOptions.cause = options.cause;
	}

	const error = new BaseError(registryEntry.message, errorOptions) as SdkError;
	error.name = code;
	error.code = code;
	error.severity = registryEntry.severity;

	return error;
}

/**
 * Create a transaction error
 * This is a convenience method for transaction-related errors
 */
export function createTransactionError(
	code: ErrorCode,
	options: CreateErrorOptions = {},
): SdkError {
	return createError(code, options);
}

/**
 * Create a user rejection error
 * This is a convenience method for the common case of user rejection
 */
export function createUserRejectionError(): SdkError {
	return createError('TX_USER_REJECTED');
}

/**
 * Check if an error is a SDK error with the specified code
 */
export function isErrorWithCode(
	error: unknown,
	code: ErrorCode,
): error is SdkError {
	return (
		error !== null &&
		typeof error === 'object' &&
		'code' in error &&
		(error as SdkError).code === code
	);
}

/**
 * Check if an error is any SDK error
 */
export function isSdkError(error: unknown): error is SdkError {
	return (
		error !== null &&
		typeof error === 'object' &&
		'code' in error &&
		typeof (error as SdkError).code === 'string'
	);
}
