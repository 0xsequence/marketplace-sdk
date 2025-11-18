/**
 * Client Proxy Utilities
 *
 * Provides helper functions for wrapping API clients with automatic field normalization.
 * Eliminates repetitive chainId conversion and other field transformations.
 */

import type { ChainId } from '../types/primitives';

/**
 * Convert chainId from number to string for API requests
 */
export function chainIdToString(chainId: ChainId): string {
	return chainId.toString();
}

/**
 * Creates a method wrapper that automatically normalizes chainId from number to string.
 * Handles the most common pattern where only chainId needs conversion.
 *
 * @example
 * ```typescript
 * const listCollectibles = wrapChainId(
 *   (req) => rawClient.listCollectibles(req)
 * );
 * // Usage: await listCollectibles({ chainId: 137 }) // chainId auto-converted to "137"
 * ```
 */
export function wrapChainId<TRequest, TResponse>(
	clientMethod: (
		apiReq: Omit<TRequest, 'chainId'> & { chainId: string },
	) => Promise<TResponse>,
): (req: TRequest & { chainId: ChainId }) => Promise<TResponse> {
	return async (req: TRequest & { chainId: ChainId }) => {
		return clientMethod({
			...(req as object),
			chainId: chainIdToString(req.chainId),
		} as Omit<TRequest, 'chainId'> & { chainId: string });
	};
}

/**
 * Creates a method wrapper that automatically normalizes chainId and collectionAddress fields.
 * Handles the common pattern where both chainId and contractAddress→collectionAddress need conversion.
 *
 * @example
 * ```typescript
 * const listCollectibles = wrapCollectionAddress(
 *   (req) => rawClient.listCollectibles(req)
 * );
 * // Usage: await listCollectibles({ chainId: 137, collectionAddress: '0x...' })
 * // Auto-converts: chainId: "137", contractAddress: '0x...'
 * ```
 */
export function wrapCollectionAddress<TRequest, TResponse>(
	clientMethod: (
		apiReq: Omit<TRequest, 'chainId' | 'collectionAddress'> & {
			chainId: string;
			contractAddress: string;
		},
	) => Promise<TResponse>,
): (
	req: TRequest & { chainId: ChainId; collectionAddress: string },
) => Promise<TResponse> {
	return async (
		req: TRequest & { chainId: ChainId; collectionAddress: string },
	) => {
		const { collectionAddress, ...rest } = req;
		return clientMethod({
			...(rest as object),
			chainId: chainIdToString(req.chainId),
			contractAddress: collectionAddress,
		} as Omit<TRequest, 'chainId' | 'collectionAddress'> & {
			chainId: string;
			contractAddress: string;
		});
	};
}

/**
 * Creates a method wrapper with custom request transformation.
 * Use this when you need to transform fields beyond just chainId.
 *
 * @example
 * ```typescript
 * const generateBuyTransaction = wrapWithTransform(
 *   (req) => rawClient.generateBuyTransaction(req),
 *   (req) => ({
 *     ...req,
 *     chainId: chainIdToString(req.chainId),
 *     ordersData: req.ordersData.map(transformOrderData),
 *   })
 * );
 * ```
 */
export function wrapWithTransform<TRequest, TApiRequest, TResponse>(
	clientMethod: (apiReq: TApiRequest) => Promise<TResponse>,
	transform: (req: TRequest) => TApiRequest,
): (req: TRequest) => Promise<TResponse> {
	return async (req: TRequest) => {
		return clientMethod(transform(req));
	};
}

/**
 * Creates a method wrapper with custom request AND response transformation.
 * Use this when you need to transform both the request and response.
 *
 * @example
 * ```typescript
 * const generateBuyTransaction = wrapWithBothTransform(
 *   (req) => rawClient.generateBuyTransaction(req),
 *   (req) => ({ ...req, chainId: chainIdToString(req.chainId) }),
 *   (res) => ({ ...res, steps: transformSteps(res.steps) })
 * );
 * ```
 */
export function wrapWithBothTransform<
	TRequest,
	TApiRequest,
	TApiResponse,
	TResponse,
>(
	clientMethod: (apiReq: TApiRequest) => Promise<TApiResponse>,
	requestTransform: (req: TRequest) => TApiRequest,
	responseTransform: (res: TApiResponse) => TResponse,
): (req: TRequest) => Promise<TResponse> {
	return async (req: TRequest) => {
		const apiResponse = await clientMethod(requestTransform(req));
		return responseTransform(apiResponse);
	};
}

/**
 * Type-safe passthrough wrapper for methods that don't need transformation.
 *
 * @example
 * ```typescript
 * const execute = passthrough((req) => rawClient.execute(req));
 * ```
 */
export function passthrough<TRequest, TResponse>(
	clientMethod: (req: TRequest) => Promise<TResponse>,
): (req: TRequest) => Promise<TResponse> {
	return clientMethod;
}

// Alias for clarity
export { wrapWithBothTransform as wrapBothTransform };
