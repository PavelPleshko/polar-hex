/* eslint-disable */
export default {
	displayName: 'yeti-demo-app',
	preset: '../../jest.preset.js',
	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	transform: {
		'^.+\\.[tj]s$': 'babel-jest',
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../coverage/packages/yeti-demo-app',
};
