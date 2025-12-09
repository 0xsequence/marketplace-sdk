/**
 * Generic Client Wrapper Utility
 *
 * Creates a wrapped client that automatically applies request/response transformations.
 * This eliminates the boilerplate of manually writing wrapper methods for each API call.
 */

/**
 * Wraps a single client method with request/response transformations
 */
export function wrapMethod<TArgs, TApiArgs, TApiResponse, TResponse>(
	rawMethod: (args: TApiArgs) => Promise<TApiResponse>,
	requestTransform: (args: TArgs) => TApiArgs,
	responseTransform: (response: TApiResponse) => TResponse,
): (args: TArgs) => Promise<TResponse> {
	return async (args: TArgs) => {
		const apiArgs = requestTransform(args);
		const rawResponse = await rawMethod(apiArgs);
		return responseTransform(rawResponse);
	};
}

/**
 * Wraps a method that only needs response transformation
 * (request args are already in the correct format)
 */
export function wrapResponseOnly<TArgs, TApiResponse, TResponse>(
	rawMethod: (args: TArgs) => Promise<TApiResponse>,
	responseTransform: (response: TApiResponse) => TResponse,
): (args: TArgs) => Promise<TResponse> {
	return async (args: TArgs) => {
		const rawResponse = await rawMethod(args);
		return responseTransform(rawResponse);
	};
}
