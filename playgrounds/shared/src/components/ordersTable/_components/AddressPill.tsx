'use client';

import { GradientAvatar, Text } from '@0xsequence/design-system';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import Pill from './Pill';

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
