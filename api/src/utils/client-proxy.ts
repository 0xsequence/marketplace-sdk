// Client Proxy Utilities

import type { ChainId } from '../types/primitives';

export function chainIdToString(chainId: ChainId): string {
	return chainId.toString();
}

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

export function wrapWithTransform<TRequest, TApiRequest, TResponse>(
	clientMethod: (apiReq: TApiRequest) => Promise<TResponse>,
	transform: (req: TRequest) => TApiRequest,
): (req: TRequest) => Promise<TResponse> {
	return async (req: TRequest) => {
		return clientMethod(transform(req));
	};
}

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

export function passthrough<TRequest, TResponse>(
	clientMethod: (req: TRequest) => Promise<TResponse>,
): (req: TRequest) => Promise<TResponse> {
	return clientMethod;
}

export { wrapWithBothTransform as wrapBothTransform };
