const jestConfig = {
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    coverageDirectory  : './coverage',
    coverageReporters  : ['html', 'text', 'text-summary'],
    coverageThreshold  : {
        global: {
            branches  : 80,
            functions : 80,
            lines     : 80,
            statements: 80
        }
    },
    moduleFileExtensions: [
        'web.js',
        'js',
        'web.ts',
        'ts',
        'web.tsx',
        'tsx',
        'json',
        'web.jsx',
        'jsx',
        'node'
    ],
    moduleNameMapper: {
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        '^react-native$'                 : 'react-native-web'
    },
    resolver          : require.resolve('jest-pnp-resolver'),
    setupFiles        : ['react-app-polyfill/jsdom'],
    setupFilesAfterEnv: ['<rootDir>/config/jest/jestEnzyme.js'],
    testEnvironment   : 'jsdom',
    testMatch         : [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}'
    ],
    transform: {
        '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
        '^.+\\.(js|jsx|ts|tsx)$'             : '<rootDir>/node_modules/babel-jest',
        '^.+\\.css$'                         : '<rootDir>/config/jest/cssTransform.js'
    },
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss)$'
    ],
    watchPlugins: [
        '<rootDir>/node_modules/jest-watch-typeahead/filename.js',
        '<rootDir>/node_modules/jest-watch-typeahead/testname.js'
    ]
};

module.exports = jestConfig;
