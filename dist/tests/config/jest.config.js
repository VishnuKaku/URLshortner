const config = {
    preset: 'ts-jest/presets/default-esm', // Ensures ESM compatibility
    testEnvironment: 'node', // Node.js environment
    moduleFileExtensions: ['ts', 'js', 'json'], // Added `json` for completeness
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }], // Use your TypeScript config
        '^.+\\.js$': 'babel-jest' // Transform JS files with Babel
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1' // Maps `@/` to the `src` folder
    },
    setupFilesAfterEnv: ['<rootDir>/tests/config/setup.ts'], // Setup files for initializing test environment
    testMatch: ['<rootDir>/tests/**/*.test.ts'], // Specifies test files
    rootDir: '../../', // Adjust root directory
    transformIgnorePatterns: [
        '/node_modules/(?!(nanoid|ua-parser-js)/)', // Transforms specific modules (e.g., nanoid)
    ],
    moduleDirectories: ['node_modules', '<rootDir>/src'], // Module resolution paths
    testTimeout: 30000, // Increase timeout for long-running tests
    extensionsToTreatAsEsm: ['.ts'], // Treat `.ts` files as ESM
    globals: {
        'ts-jest': {
            useESM: true // Ensure ts-jest uses ESM
        }
    }
};
export default config;
