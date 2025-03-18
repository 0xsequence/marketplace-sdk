export class TransactionLogger {
	constructor(
		private readonly context: string,
		private readonly enabled: boolean = true,
	) {}

	private formatData(data: unknown): unknown {
		if (data instanceof Error) {
			return {
				name: data.name,
				message: data.message,
				cause:
					data.cause instanceof Error
						? this.formatData(data.cause)
						: data.cause,
				stack: data.stack?.split('\n').slice(0, 3),
			};
		}

		if (Array.isArray(data)) {
			return data.map((item) => this.formatData(item));
		}

		if (typeof data === 'object' && data !== null) {
			return Object.fromEntries(
				Object.entries(data).map(([key, value]) => [
					key,
					this.formatData(value),
				]),
			);
		}

		return data;
	}

	private log(
		level: 'debug' | 'error' | 'info',
		message: string,
		data?: unknown,
	) {
		if (!this.enabled) return;
		console[level](
			`[${this.context}] ${message}`,
			data ? this.formatData(data) : '',
		);
	}

	debug(message: string, data?: unknown): void {
		this.log('debug', message, data);
	}

	error(message: string, error: unknown): void {
		this.log('error', message, error);
	}

	info(message: string, data?: unknown): void {
		this.log('info', message, data);
	}

	state(from: string, to: string): void {
		this.info(`State transition: ${from} -> ${to}`);
	}
}

export const createLogger = (
	context: string,
	enabled = true,
): TransactionLogger => new TransactionLogger(context, enabled);
