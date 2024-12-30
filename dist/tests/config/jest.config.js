// tests/config/jest.config.ts
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/../../tests'],
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/../../src/$1',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(nanoid)/)',
    ],
    setupFiles: ['<rootDir>/setup.ts']
};
