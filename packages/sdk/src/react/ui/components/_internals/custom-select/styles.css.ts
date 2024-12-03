import { atoms } from '@0xsequence/design-system';
import { style } from '@vanilla-extract/css';

export const trigger = style([
	atoms({
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 'circle',
		paddingX: '3',
		fontSize: 'small',
		height: '7',
		gap: '2',
		background: 'backgroundSecondary',
		color: 'text100',
		cursor: 'pointer',
		border: 'none',
		marginRight: '1',
	}),
]);

export const content = style([
	atoms({
		background: 'backgroundRaised',
		borderWidth: 'thin',
		borderColor: 'backgroundControl',
		backdropFilter: 'blur',
		borderStyle: 'solid',
		borderRadius: 'md',
		overflow: 'hidden',
		zIndex: '30',
	}),
]);

export const item = style([
	atoms({
		fontSize: 'small',
		color: 'text100',
		borderRadius: 'none',
		display: 'flex',
		alignItems: 'center',
		height: '7',
		padding: '2',
		paddingLeft: '6',
		position: 'relative',
		userSelect: 'none',
		cursor: 'pointer',
	}),
	{
		':hover': {
			background: 'var(--seq-colors-background-muted)',
		},
	},
]);

export const itemIndicator = style([
	atoms({
		position: 'absolute',
		left: '1',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
	}),
]);
