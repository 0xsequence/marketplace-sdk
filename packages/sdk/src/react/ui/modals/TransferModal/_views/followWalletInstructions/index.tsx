import { Button, Text } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import AlertMessage from '../../../_internal/components/alertMessage';
import getMessage from '../../messages';

const FollowWalletInstructionsView = observer(() => {
	return (
		<div className="grid gap-6 grow">
			<Text className="text-xl font-body" color="white" fontWeight="bold">
				Transfer your item
			</Text>
			<div className="flex flex-col gap-3">
				<AlertMessage
					message={getMessage('followWalletInstructions')}
					type="info"
				/>
			</div>
			<Button
				className="flex justify-self-end px-10"
				disabled={true}
				title="Transfer"
				label="Transfer"
				variant="primary"
				shape="square"
				size="sm"
			/>
		</div>
	);
});

export default FollowWalletInstructionsView;
