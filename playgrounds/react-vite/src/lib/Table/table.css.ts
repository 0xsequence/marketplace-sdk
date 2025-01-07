import { style } from '@vanilla-extract/css';

const tableDiv = style({
	position: 'relative',
	width: '100%',
	overflow: 'auto',
});

const table = style({
	width: '100%',
	captionSide: 'bottom',
	fontSize: '0.875rem',
});

const tableHeader = style({
	backgroundColor: 'hsl(var(--foreground) / 0.1)',
	borderBottom: '1px solid hsl(var(--border))',
});

const tableBody = style({
	borderBottom: 'none',
});

const tableFooter = style({
	borderTop: '1px solid hsl(var(--foreground) / 0.1)',
	// selectors: {
	//   [`& tr`]: {
	//     backgroundColor: 'hsl(var(--foreground) / 0.1)',
	//     fontWeight: 500
	//   },
	//   [`& tr:last-child`]: {
	//     borderBottom: 'none'
	//   }
	// }
});

const tableRow = style({
	borderBottom: '1px solid hsl(var(--border))',
	transitionProperty: 'background-color',
	transitionDuration: '0.3s',
	backgroundColor: 'transparent',
	':hover': {
		backgroundColor: 'hsl(var(--foreground) / 0.01)',
	},
	selectors: {
		'&[data-state="selected"]': {
			backgroundColor: 'hsl(var(--accent) / 0.4)',
		},
		'&[data-state="selected"]:nth-child(odd)': {
			backgroundColor: 'hsl(var(--accent) / 0.4)',
		},
	},
});

const tableHead = style({
	height: '3rem',
	paddingLeft: '1rem',
	paddingRight: 0,
	textAlign: 'left',
	verticalAlign: 'middle',
	fontWeight: 500,
	color: 'hsl(var(--foreground))',
	'@media': {
		'(max-width: 768px)': {
			height: 'max-content',
			padding: '4px',
		},
	},
});

const tableCell = style({
	padding: '1rem',
	verticalAlign: 'middle',
	selectors: {
		'&:has([role="checkbox"])': {
			paddingRight: 0,
		},
	},
});

const tableCaption = style({
	marginTop: '1rem',
	fontSize: '0.875rem',
	color: 'hsl(var(--muted-foreground))',
});

export const styles = {
	tableDiv,
	table,
	tableHeader,
	tableBody,
	tableFooter,
	tableRow,
	tableHead,
	tableCell,
	tableCaption,
} as const;
