import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
	parameters: {
		backgrounds: {
			options: {
				dark: { name: 'Dark', value: '#333' },
				light: { name: 'Light', value: '#F7F9F2' },
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	initialGlobals: {
		backgrounds: { value: 'dark' },
	},
};

export default preview;
