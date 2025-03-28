import { Button, Spinner } from '@0xsequence/design-system';

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
			size="lg"
		/>

		<Button
			disabled={disabled || confirmed}
			pending={loading}
			onClick={onConfirm}
			label={
				!confirmed ? (
					<div className="flex items-center gap-2">
						Continue with {tokenSymbol}
					</div>
				) : (
					<Spinner size="sm" className="text-white" />
				)
			}
			variant={'primary'}
			shape="square"
			size="md"
		/>
	</div>
);

export default ActionButtons;
