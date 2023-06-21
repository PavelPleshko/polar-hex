// const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./site/**/*.{html,njk,md}'],
	theme: {
		extend: {
			opacity: () => ({
				5: '.05',
				10: '.1',
				15: '.15',
				20: '.2',
			}),
			height: () => ({
				'1/2': '50vh',
				'3/4': '75vh',
				'9/10': '90vh',
				'1/1': '100vh',
				'1/3': 'calc(100vh / 3)',
				'1/4': 'calc(100vh / 4)',
				'1/5': 'calc(100vh / 5)',
				96: '24rem',
				128: '32rem',
			}),
		},
	},
	variants: {},
};
