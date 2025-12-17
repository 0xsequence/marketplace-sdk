import type { defaultContext } from './store';

export function validateStoreSnapshot(
	snapshot: unknown,
): snapshot is typeof defaultContext {
	if (!snapshot || typeof snapshot !== 'object') return false;

	const s = snapshot as typeof defaultContext;

	if (typeof s.projectId !== 'string') return false;

	if (typeof s.activeTab !== 'string') return false;

	if (!['infinite', 'paginated'].includes(s.paginationMode)) return false;

	if (s.orderbookKind !== undefined && typeof s.orderbookKind !== 'string')
		return false;

	if (!s.sdkConfig || typeof s.sdkConfig !== 'object') return false;
	if (typeof s.sdkConfig.projectId !== 'string') return false;
	if (typeof s.sdkConfig.projectAccessKey !== 'string') return false;

	if (s.sdkConfig._internal) {
		const overrides = s.sdkConfig._internal.overrides;
		if (overrides) {
			if (
				overrides.marketplaceConfig !== undefined &&
				typeof overrides.marketplaceConfig !== 'object'
			)
				return false;

			if (overrides.api !== undefined && typeof overrides.api !== 'object')
				return false;

			if (!Array.isArray(overrides.collections)) return false;

			for (const collection of overrides.collections) {
				if (!collection || typeof collection !== 'object') return false;
				if (typeof collection.chainId !== 'number') return false;
				if (typeof collection.contractAddress !== 'string') return false;

				if (
					collection.name !== undefined &&
					typeof collection.name !== 'string'
				)
					return false;
				if (
					collection.symbol !== undefined &&
					typeof collection.symbol !== 'string'
				)
					return false;
				if (
					collection.description !== undefined &&
					typeof collection.description !== 'string'
				)
					return false;
				if (
					collection.bannerUrl !== undefined &&
					typeof collection.bannerUrl !== 'string'
				)
					return false;
				if (
					collection.ogImage !== undefined &&
					typeof collection.ogImage !== 'string'
				)
					return false;
				if (
					collection.contractType !== undefined &&
					typeof collection.contractType !== 'string'
				)
					return false;
				if (
					collection.feePercentage !== undefined &&
					typeof collection.feePercentage !== 'number'
				)
					return false;
				if (
					collection.currencyOptions !== undefined &&
					!Array.isArray(collection.currencyOptions)
				)
					return false;
				if (
					collection.saleAddress !== undefined &&
					typeof collection.saleAddress !== 'string'
				)
					return false;
			}
		}
	}

	return true;
}
