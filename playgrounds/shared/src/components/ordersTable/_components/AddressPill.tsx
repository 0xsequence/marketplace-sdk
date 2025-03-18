'use client';

import { truncateMiddle } from '../../../../../../packages/sdk/src';
import Pill from './Pill';
import { GradientAvatar, Text } from '@0xsequence/design-system';

const AddressPill = ({ address }: { address: string }) => {
	return (
		<Pill>
			<GradientAvatar address={address.toLowerCase()} size="xs" />

			<Text className="font-medium text-primary text-xs">
				{truncateMiddle(address, 2, 3)}
			</Text>
		</Pill>
	);
};

export default AddressPill;
