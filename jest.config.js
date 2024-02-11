module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	testMatch: ["**/test/**/*.spec.tsx"],
	collectCoverageFrom: [
		"<rootDir>/src/**/*.tsx",
		"!<rootDir>/src/types/**/*.tsx",
	],
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				diagnostics: false,
				isolatedModules: true,
			},
		],
	},
};
