import { Button, Text } from '@0xsequence/design-system';

export type ViewMode = 'infinite' | 'paginated';

interface ViewModeSelectorProps {
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	className?: string;
	showLabel?: boolean;
}

export function ViewModeSelector({
	viewMode,
	onViewModeChange,
	className = '',
	showLabel = true,
}: ViewModeSelectorProps) {
	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{showLabel && (
				<Text variant="small" color="text80">
					View Mode:
				</Text>
			)}
			<div className="flex rounded-lg border border-border-base bg-background-secondary">
				<Button
					size="xs"
					variant={viewMode === 'infinite' ? 'primary' : 'ghost'}
					onClick={() => onViewModeChange('infinite')}
					className="rounded-r-none border-border-base border-r"
				>
					Infinite
				</Button>
				<Button
					size="xs"
					variant={viewMode === 'paginated' ? 'primary' : 'ghost'}
					onClick={() => onViewModeChange('paginated')}
					className="rounded-l-none"
				>
					Paginated
				</Button>
			</div>
		</div>
	);
}
