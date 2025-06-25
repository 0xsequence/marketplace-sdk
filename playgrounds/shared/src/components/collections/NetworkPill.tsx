import { getNetwork } from '@0xsequence/connect';
import { NetworkImage, Text } from '@0xsequence/design-system';

export interface NetworkPillProps {
	chainId: number;
	position?: 'absolute' | 'relative';
	className?: string;
}

export function NetworkPill({
	chainId,
	position = 'absolute',
	className = '',
}: NetworkPillProps) {
	const network = getNetwork(chainId);

	const baseClasses =
		'flex items-center gap-1 rounded-full bg-background-primary shadow-sm';
	const positionClasses =
		position === 'absolute'
			? 'absolute top-3 right-3 z-10 px-3 py-1.5'
			: 'px-3 py-1.5';

	const finalClasses = `${baseClasses} ${positionClasses} ${className}`.trim();

	return (
		<div className={finalClasses}>
			<Text variant="small" color="text80" fontWeight="bold">
				{network.name}
			</Text>
			<NetworkImage chainId={chainId} size="xs" />
		</div>
	);
}
