/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				// Base colors
				background: {
					primary: 'var(--background-primary)',
					secondary: 'var(--background-secondary)',
				},
				border: {
					base: 'hsla(0, 0%, 31%, 1)',
					focus: 'hsla(247, 100%, 75%, 1)',
					hover: 'hsla(247, 100%, 75%, 0.8)',
				},
				outline: {
					focus: 'hsla(254, 100%, 57%, 1)',
					dark: '#000000',
				},
				overlay: {
					light: 'hsla(0, 0%, 100%, 0.1)',
					glass: 'hsla(0, 0%, 100%, 0.05)',
				},
				text: {
					50: 'var(--text-50)',
					80: 'var(--text-80)',
					100: 'var(--text-100)',
				},
				button: {
					primary: 'var(--button-primary)',
					hover: 'var(--button-hover)',
				},
			},
			boxShadow: {
				'focus-ring': '0px 0px 0px 2px hsla(247, 100%, 75%, 1)',
				'active-ring': '0px 0px 0px 1px hsla(247, 100%, 75%, 1)',
				card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'card-hover':
					'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				button: '0px 2px 4px rgba(0, 0, 0, 0.1)',
			},
			outline: {
				focus: ['4px solid hsla(254, 100%, 57%, 1)', '2px'],
			},
			width: {
				card: '175px',
			},
			height: {
				card: '175px',
				'action-offset': '44px',
			},
			scale: {
				hover: '1.165',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				shimmer: {
					'100%': { transform: 'translateX(100%)' },
				},
				bellRing: {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(10deg)' },
					'75%': { transform: 'rotate(-10deg)' },
				},
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-in-out',
				shimmer: 'shimmer 1.5s infinite',
				'bell-ring': 'bellRing 0.4s ease-in-out',
			},
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1rem' }],
				sm: ['0.875rem', { lineHeight: '1.25rem' }],
				base: ['1rem', { lineHeight: '1.5rem' }],
				lg: ['1.125rem', { lineHeight: '1.75rem' }],
			},
			fontFamily: {
				body: ['var(--font-body)', 'system-ui', 'sans-serif'],
			},
			backdropFilter: {
				blur: 'blur(8px)',
			},
			transitionDuration: {
				200: '200ms',
				300: '300ms',
			},
			transitionTimingFunction: {
				'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
		},
	},
	plugins: [],
};
