import type React from 'react';

import { NetworkImage as OriginalNetworkImage } from '@0xsequence/design-system';
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
		<div className={customNetworkImageRoot({ size })}>
			<OriginalNetworkImage {...props} className={originalNetworkImage} />
		</div>
	);
};

export default CustomNetworkImage;
