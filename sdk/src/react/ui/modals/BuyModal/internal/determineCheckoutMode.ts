import type { CheckoutMode } from '../../../../../types';

export type DetermineCheckoutModeParams = {
	checkoutModeConfig: CheckoutMode | undefined;
	isChainSupported: boolean;
	canBeUsedWithTrails: boolean;
};

export function determineCheckoutMode({
	checkoutModeConfig,
	isChainSupported,
	canBeUsedWithTrails,
}: DetermineCheckoutModeParams): CheckoutMode | undefined {
	if (
		checkoutModeConfig === 'trails' &&
		isChainSupported &&
		canBeUsedWithTrails
	) {
		return 'trails';
	}

	if (
		checkoutModeConfig === 'trails' &&
		isChainSupported &&
		!canBeUsedWithTrails
	) {
		return 'crypto';
	}

	if (checkoutModeConfig === 'trails' && !isChainSupported) {
		return 'crypto';
	}

	if (
		typeof checkoutModeConfig === 'object' &&
		checkoutModeConfig.mode === 'sequence-checkout'
	) {
		return {
			mode: 'sequence-checkout',
			options: checkoutModeConfig.options,
		};
	}

	if (checkoutModeConfig === 'crypto') {
		return 'crypto';
	}

	return undefined;
}
