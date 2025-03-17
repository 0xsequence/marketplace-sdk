'use client';

import { truncateMiddle } from '../../../../../../packages/sdk/src';
import Pill from './Pill';
import { GradientAvatar, Text } from '@0xsequence/design-system';

const AddressPill = ({ address }: { address: string }) => {
	return (
		<Pill>
			<GradientAvatar address={address.toLowerCase()} size="xs" />

			<Text color="text100" fontSize="xsmall" fontWeight="bold">
				{truncateMiddle(address, 15, 3)}
			</Text>
		</Pill>
	);
};

export default AddressPill;
