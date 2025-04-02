'use client';

import { Button, Skeleton, Spinner } from '@0xsequence/design-system';

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
			pending={loading}
			onClick={onCancel}
			label={<div className="flex items-center gap-2">Cancel</div>}
			variant={'ghost'}
			shape="square"
			size="md"
		/>

		<Button
			disabled={disabled}
			pending={loading || confirmed}
			onClick={onConfirm}
			label={
				<div className="flex items-center gap-2">
					{!confirmed ? (
						tokenSymbol ? (
							`Continue with ${tokenSymbol}`
						) : (
							<div className="flex items-center gap-2">
								Continue with
								<Skeleton className="h-[20px] w-6 animate-shimmer" />
							</div>
						)
					) : (
						<div className="flex items-center gap-2">
							<Spinner size="sm" />
							Confirming
						</div>
					)}
				</div>
			}
			variant={'primary'}
			shape="square"
			size="md"
		/>
	</div>
);

export default ActionButtons;
