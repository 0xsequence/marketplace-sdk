import {
	type ComponentPropsWithRef,
	type ForwardedRef,
	forwardRef,
} from 'react';

type VirtuosoGridListProps = ComponentPropsWithRef<'div'>;

export const GridContainer = forwardRef(
	(props: VirtuosoGridListProps, ref: ForwardedRef<HTMLDivElement>) => {
		const { className, style, ...otherProps } = props;

		// Since Tailwind grid classes aren't working, use CSS Grid directly
		const gridStyle: React.CSSProperties = {
			display: 'grid',
			width: '100%',
			gap: '0.5rem',
			paddingRight: '0.5rem',
			alignItems: 'start',
			gridTemplateColumns: 'repeat(3, 1fr)', // Default to 3 columns
			...style, // Allow style prop to override
		};

		return (
			<div
				className={`grid w-full ${className || ''}`}
				style={gridStyle}
				ref={ref}
				{...otherProps}
			/>
		);
	},
);

GridContainer.displayName = 'GridContainer';
