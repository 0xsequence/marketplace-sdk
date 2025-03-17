import { Button, Text } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import AlertMessage from '../../../_internal/components/alertMessage';
import getMessage from '../../messages';
import { JSX } from 'react/jsx-runtime';

const FollowWalletInstructionsView: () => JSX.Element = observer((): JSX.Element => {
	return (
		<div className="grid grow gap-6">
			<Text className="font-body text-xl" color="white" fontWeight="bold">
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
