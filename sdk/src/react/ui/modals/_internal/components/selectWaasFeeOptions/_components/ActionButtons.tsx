'use client';

import { Button, Skeleton, Spinner } from '@0xsequence/design-system';

type ButtonContentProps = {
	confirmed: boolean;
	tokenSymbol?: string;
};

const ButtonContent = ({ confirmed, tokenSymbol }: ButtonContentProps) => {
	if (confirmed) {
		return (
			<div className="flex items-center gap-2">
				<Spinner size="sm" />
				Confirming
			</div>
		);
	}

	if (!tokenSymbol) {
		return (
			<div className="flex items-center gap-2">
				Continue with
				<Skeleton className="h-[20px] w-6 animate-shimmer" />
			</div>
		);
	}

	return `Continue with ${tokenSymbol}`;
};

const ActionButtons = ({
	onCancel,
	onConfirm,
	disabled,
	loading,
	confirmed,
	tokenSymbol,
}: {
	onCancel: () => void;
	onConfirm: () => void;
	disabled: boolean;
	loading: boolean;
	confirmed: boolean;
	tokenSymbol?: string;
}) => (
	<div className="mt-4 flex w-full items-center justify-end gap-2">
		<Button
			disabled={loading}
			onClick={onCancel}
			variant={'ghost'}
			shape="square"
			size="md"
		>
			<div className="flex items-center gap-2">Cancel</div>
		</Button>

		<Button
			disabled={disabled || loading || confirmed}
			onClick={onConfirm}
			variant={'primary'}
			shape="square"
			size="md"
		>
			<div className="flex items-center gap-2">
				<ButtonContent confirmed={confirmed} tokenSymbol={tokenSymbol} />
			</div>
		</Button>
	</div>
);

export default ActionButtons;
