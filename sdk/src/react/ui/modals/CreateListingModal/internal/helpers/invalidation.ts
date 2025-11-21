import type { Address } from 'viem';

export type ApprovalDependencies = {
	currency: Address | undefined;
	collectionAddress: Address;
};

/**
 * Detect if approval is invalidated based on dependency changes
 * Pure function - no React hooks, fully testable
 */
export function isApprovalInvalidated(
	prevDeps: ApprovalDependencies,
	currentDeps: ApprovalDependencies,
	approvalCompleted: boolean,
): boolean {
	if (!approvalCompleted) return false;

	// Approval is invalidated if currency or collection changed
	return (
		prevDeps.currency !== currentDeps.currency ||
		prevDeps.collectionAddress !== currentDeps.collectionAddress
	);
}

/**
 * Get invalidation reason message
 * Pure function - no React hooks, fully testable
 */
export function getInvalidationReason(
	prevDeps: ApprovalDependencies,
	currentDeps: ApprovalDependencies,
): string | null {
	if (prevDeps.currency !== currentDeps.currency) {
		return 'Currency changed - approval needs to be redone';
	}

	if (prevDeps.collectionAddress !== currentDeps.collectionAddress) {
		return 'Collection changed - approval needs to be redone';
	}

	return null;
}
