import { Button, Text } from '@0xsequence/design-system';

export type MarketType = 'market' | 'shop';

interface MarketTypeToggleProps {
	marketType: MarketType;
	onMarketTypeChange: (type: MarketType) => void;
	className?: string;
	showTitle?: boolean;
	variant?: 'button' | 'toggle';
}

export function MarketTypeToggle({
	marketType,
	onMarketTypeChange,
	className = '',
	showTitle = true,
	variant = 'button',
}: MarketTypeToggleProps) {
	const toggleMarketType = () => {
		onMarketTypeChange(marketType === 'market' ? 'shop' : 'market');
	};

	if (variant === 'button') {
		return (
			<div className={`flex items-center justify-between ${className}`}>
				{showTitle && (
					<Text variant="xlarge" color="text80">
						{marketType === 'market'
							? 'Market Collections'
							: 'Shop Collections'}
					</Text>
				)}
				<Button onClick={toggleMarketType} variant="secondary">
					Switch to {marketType === 'market' ? 'Shop' : 'Market'}
				</Button>
			</div>
		);
	}

	// Toggle variant - similar to ViewModeSelector
	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{showTitle && (
				<Text variant="small" color="text80">
					Market Type:
				</Text>
			)}
			<div className="flex rounded-lg border border-border-base bg-background-secondary">
				<Button
					size="xs"
					variant={marketType === 'market' ? 'primary' : 'ghost'}
					onClick={() => onMarketTypeChange('market')}
					className="rounded-r-none border-border-base border-r"
				>
					Market
				</Button>
				<Button
					size="xs"
					variant={marketType === 'shop' ? 'primary' : 'ghost'}
					onClick={() => onMarketTypeChange('shop')}
					className="rounded-l-none"
				>
					Shop
				</Button>
			</div>
		</div>
	);
}
