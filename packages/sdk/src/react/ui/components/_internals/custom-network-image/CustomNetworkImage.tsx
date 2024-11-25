import type React from 'react';

import {
	Box,
	NetworkImage as OriginalNetworkImage,
} from '@0xsequence/design-system';
import { customNetworkImageRoot, originalNetworkImage } from './styles.css';

type CustomSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CustomNetworkImageProps
	extends Omit<React.ComponentProps<typeof OriginalNetworkImage>, 'size'> {
	size: CustomSize;
}

const CustomNetworkImage: React.FC<CustomNetworkImageProps> = ({
	size,
	...props
}) => {
	return (
		<Box className={customNetworkImageRoot({ size })}>
			<OriginalNetworkImage {...props} className={originalNetworkImage} />
		</Box>
	);
};

export default CustomNetworkImage;
