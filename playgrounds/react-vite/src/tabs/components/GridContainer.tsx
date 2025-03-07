import {
	type ComponentPropsWithRef,
	type ForwardedRef,
	forwardRef,
} from 'react';

type VirtuosoGridListProps = ComponentPropsWithRef<'div'>;

const gridContainerStyle: React.CSSProperties = {
	display: 'grid',
	gridTemplateColumns: 'repeat(3, 1fr)',
	gap: '16px',
	width: '100%',
	padding: '12px 0',
};

export const GridContainer = forwardRef(
	(props: VirtuosoGridListProps, ref: ForwardedRef<HTMLDivElement>) => {
		const { className, style, ...otherProps } = props;

		return (
			<div
				className={`grid-container ${className || ''}`}
				style={{
					...gridContainerStyle,
					...style,
				}}
				ref={ref}
				{...otherProps}
			/>
		);
	},
);

GridContainer.displayName = 'GridContainer';
