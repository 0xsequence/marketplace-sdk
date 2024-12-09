export type Result<T> = {
	data?: T;
	error?: Error;
	isLoading: boolean;
	isComplete: boolean;
};

export default class AsyncResultHandler<T> {
	private state: Result<T> = {
		isLoading: false,
		isComplete: false,
	};

	constructor(private onError?: (error: Error) => void) {}

	getState(): Result<T> {
		return this.state;
	}

	async execute(operation: () => Promise<T>): Promise<Result<T>> {
		try {
			this.state = {
				...this.state,
				isLoading: true,
				isComplete: false,
				error: undefined,
			};

			const data = await operation();

			this.state = {
				data,
				isLoading: false,
				isComplete: true,
			};

			return this.state;
		} catch (error) {
			const err = error as Error;
			this.state = {
				isLoading: false,
				isComplete: true,
				error: err,
			};

			if (this.onError) {
				this.onError(err);
			}

			return this.state;
		}
	}
}