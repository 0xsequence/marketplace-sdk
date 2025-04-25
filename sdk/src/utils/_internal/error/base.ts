export type ErrorType<name extends string = 'Error'> = Error & { name: name };

export type Compute<type> = { [key in keyof type]: type[key] } & unknown;

type BaseErrorOptions = Compute<
	| { details?: string | undefined; docsUrl?: string | undefined }
	| { cause: BaseError | Error }
>;

export class BaseError extends Error {
	details: string;
	shortMessage: string;
	docsUrl?: string;

	name = 'MarketplaceSdkBaseError';

	constructor(shortMessage: string, options: BaseErrorOptions = {}) {
		super();

		const details = 'details' in options ? options.details : '';
		this.message = [
			shortMessage || 'An error occurred.',
			'',
			...(details ? [`Details: ${details}`] : []),
		].join('\n');

		if ('cause' in options && options.cause) {
			this.cause = options.cause;
		}

		if ('docsUrl' in options && options.docsUrl) {
			this.docsUrl = options.docsUrl;
		}

		this.details = details || '';
		this.shortMessage = shortMessage;
	}
}
